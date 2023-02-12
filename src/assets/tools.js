const URL_BASE = "http://127.0.0.1:5050/v1/";
let execute = async (base, functionName, body, header = {}) => {
    try {
        let _header = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "1234567890",
        };
        header = { ..._header, ...header };
        // set timeout to 120 seconds
        let timeout = 120000;
        let result = await fetch(URL_BASE + base + "/" + functionName, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
            timeout: timeout,
        });

        result = await result.json();
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// export execute function
export { execute };
