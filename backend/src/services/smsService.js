const SMS_API_URL = "http://ippanel.com/api/select";

async function sendOtpSms(phone, code) {
    const username = process.env.IPPANEL_USERNAME;
    const password = process.env.IPPANEL_PASSWORD;
    const fromNum = process.env.IPPANEL_FROM_NUMBER;
    const patternCode = process.env.IPPANEL_PATTERN_CODE;

    if (!username || !password || !fromNum || !patternCode) {
        throw new Error("IPPanel environment variables are not configured");
    }

    const payload = {
        op: "pattern",
        user: username,
        pass: password,
        fromNum, 
        toNum: phone,
        patternCode,
        inputData: [
            {
                user_code: String(code)
            }
        ]
    };

    const response = await fetch(SMS_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `IPPanel HTTP error: ${response.status}`
        );
    }

    let result;

    try {
        result = JSON.parse(responseText);
    } catch {
        result = responseText;
    }

    console.log("IPPanel response:", result);

    return result;
}

module.exports = {
    sendOtpSms
};