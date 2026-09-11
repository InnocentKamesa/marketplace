const getPayChanguBaseUrl = () => {
    return (process.env.PAYCHANGU_API_URL || "https://sandbox.paychangu.com").replace(/\/$/, "");
};

const extractPayChanguTransaction = (payload) => {
    if (!payload) {
        return {};
    }

    if (payload.data && typeof payload.data === "object") {
        return payload.data;
    }

    return payload;
};

const normalizePayAmount = (amount) => Number(Number(amount || 0).toFixed(2));


export const normalizePayChanguStatus = (status = "") => {
    const normalized = String(status).trim().toLowerCase();
    const successStatuses = [
        "success",
        "successful",
        "paid",
        "completed",
        "complete",
        "approved",
    ];
    const pendingStatuses = [
        "pending",
        "processing",
        "awaiting",
        "in_progress",
        "in-progress",
    ];

    if (successStatuses.includes(normalized)) {
        return "paid";
    }

    if (pendingStatuses.includes(normalized)) {
        return "pending";
    }

    return "failed";
};


export const verifyPayChanguTransaction = async ({ reference, amount, currency = "MKW" }) => {
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;
    const apiBaseUrl = getPayChanguBaseUrl();

    if (!secretKey) {
        return {
            success: true,
            status: "paid",
            message: "PayChangu secret key is not set. Using local verification mode in development.",
            source: "sandbox",
        };
    }

    const urls = [
        `${apiBaseUrl}/transactions/${reference}`,
        `${apiBaseUrl}/transactions/verify/${reference}`,
        `${apiBaseUrl}/verify/${reference}`,
    ];

    let verificationError = null;

    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                verificationError = new Error(`PayChangu verification failed with status ${response.status}`);
                continue;
            }

            const transaction = extractPayChanguTransaction(payload);
            const normalizedStatus = normalizePayChanguStatus(
                transaction.status || transaction.state || payload.status || payload.state
            );
            const transactionAmount = normalizePayAmount(
                transaction.amount || transaction.total_amount || transaction.totalAmount || payload.amount || payload.total
            );
            const amountMatches = Number(transactionAmount) >= Number(amount || 0);

            return {
                success: normalizedStatus === "paid" && amountMatches,
                status: normalizedStatus,
                amount: transactionAmount,
                currency,
                source: "paychangu",
                raw: payload,
            };
        } catch (error) {
            verificationError = error;
        }
    }

    if (verificationError) {
        throw verificationError;
    }

    throw new Error("Unable to verify payment with PayChangu");
};