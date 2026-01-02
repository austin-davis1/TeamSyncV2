export default class Api{
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    async get(path){
        try{
            const url = this.baseUrl + path;

            const response = await fetch(url, {
                method:'get'
            });

            if(response.ok){
                let responseJson = [];
                if(response.status === 200){
                    responseJson = await response.json();
                }

                return {
                    success: true,
                    status: response.status,
                    statusText: response.statusText,
                    data: responseJson
                }
            }
            else{
                if(response.status === 404){
                    return {
                        success:false,
                        status:response.status,
                        statusText:'Not Found'
                    };
                }
                else{
                    let isJsonContent = false;
                    const contentType = response.headers.get('content-type');
                    if(contentType && contentType.indexOf('application/json') !== -1){
                        isJsonContent = true;
                    }

                    const responseText = await this.getTextFromStream(response.body, isJsonContent);
                    return {
                        success: false,
                        status: response.status,
                        statusText: this.getErrorStatusText(response.status, responseText)
                    }
                }
            }
        }
        catch(err){
            return {
                success:false,
                statusText: err
            }
        }
    }

    /**
     * Http POST to return a blob object. Typically used for downloading attachments.
     * @param {string} path - Api path to be appended to the base url 
     * @param {Object} requestBody - Body of the request in JSON format
     * @returns {Promise<Object>} - Http response in the following format:
     * {
     *      success:Boolean - Whether or not the request succeeded
     *      status:Number - Http status code
     *      statusText:String - Http status code text
     *      data:blob - Blob object being returned by the request
     * }
     */
    async getBlob(path, requestBody){
        try{
            const url = this.baseUrl + path;
        
            const response = await fetch(url, {
                method:'post',
                headers: new Headers({
                    'Content-Type':'application/json',
                }),
                body:requestBody
            });

            if(response.ok){
                let responseBlob;
                if(response.status === 200){
                    responseBlob = await response.blob();
                }

                return {
                    success: true,
                    status: response.status,
                    statusText: response.statusText,
                    data: responseBlob
                }
            }
            else{
                let isJsonContent = false;
                const contentType = response.headers.get('content-type');
                if(contentType && contentType.indexOf('application/json') !== -1){
                    isJsonContent = true;
                }

                const responseText = await this.getTextFromStream(response.body, isJsonContent);
                return {
                    success: false,
                    status: response.status,
                    statusText: this.getErrorStatusText(response.status, responseText)
                }
            }
        }
        catch(err){
            return {
                success:false,
                statusText:err
            }
        }
    }

    async post(path,requestBody){
        try{
            const url = this.baseUrl + path;

            const response = await fetch(url,{
                method:'post',
                headers: new Headers({
                    'Content-Type':'application/json',
                }),
                body:requestBody
            });

            let isJsonContent = false;
            const contentType = response.headers.get('content-type');
            if(contentType && contentType.indexOf('application/json') !== -1){
                isJsonContent = true;
            }

            if(response.ok){
                let retVal = {
                    success:true,
                    status:response.status
                }

                if(isJsonContent){
                    retVal.data = await response.json();
                }

                return retVal;
            }
            else{
                const responseText = await this.getTextFromStream(response.body, isJsonContent);

                return {
                    success:false,
                    status:response.status,
                    statusText:this.getErrorStatusText(response.status, responseText)
                }
            }
        }
        catch(err){
            return {
                success:false,
                statusText:err
            }
        }
    }

    async put(path,requestBody){
        try{
            const url = this.baseUrl + path;

            const response = await fetch(url,{
                method:'put',
                headers: new Headers({
                    'Content-Type':'application/json',
                }),
                body:requestBody
            });

            let isJsonContent = false;
            const contentType = response.headers.get('content-type');
            if(contentType && contentType.indexOf('application/json') !== -1){
                isJsonContent = true;
            }

            if(response.ok){
                let retVal = {
                    success:true,
                    status:response.status
                }

                if(isJsonContent){
                    retVal.data = await response.json();
                }

                return retVal;
            }
            else{
                const responseText = await this.getTextFromStream(response.body, isJsonContent);

                return {
                    success:false,
                    status:response.status,
                    statusText:this.getErrorStatusText(response.status, responseText)
                }
            }
        }
        catch(err){
            return {
                success:false,
                statusText:err
            }
        }
    }

    async delete(path,requestBody){
        try{
            const url = this.baseUrl + path;

            const response = await fetch(url,{
                method:'delete',
                headers: new Headers({
                    'Content-Type':'application/json',
                }),
                body:requestBody
            });

            let isJsonContent = false;
            const contentType = response.headers.get('content-type');
            if(contentType && contentType.indexOf('application/json') !== -1){
                isJsonContent = true;
            }

            if(response.ok){
                let retVal = {
                    success:true,
                    status:response.status
                }

                if(isJsonContent){
                    retVal.data = await response.json();
                }

                return retVal;
            }
            else{
                const responseText = await this.getTextFromStream(response.body, isJsonContent);

                return {
                    success:false,
                    status:response.status,
                    statusText:this.getErrorStatusText(response.status, responseText)
                }
            }
        }
        catch(err){
            return {
                success:false,
                statusText:err
            }
        }
    }

    getErrorStatusText(statusCode, statusMessage){
        let codeDescription;
        switch(statusCode){
            case 400:
                codeDescription = 'Bad Request';
                break;
            case 401:
                codeDescription = 'Unauthorized';
                break;
            case 403:
                codeDescription = 'Forbidden';
                break;
            case 404:
                codeDescription = 'Not Found';
                break;
            case 405:
                codeDescription = 'Method Not Allowed';
                break;
            case 409:
                codeDescription = 'Conflict';
                break;
            case 500:
                codeDescription = 'Internal Server Error';
                break;
            case 504:
                codeDescription = 'Service Unavailable';
                break;
            default:
                codeDescription = `${statusCode}: I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal.`;
        }

        if(statusMessage){
            return `${codeDescription}: ${statusMessage}`;
        }
        else{
            return codeDescription;
        }
    }

    async getTextFromStream(readableStream, isJsonContent) {
        let reader = readableStream.getReader();
        let utf8Decoder = new TextDecoder();
        let nextChunk;
        let resultText = '';
        
        let resultStr = '';
        
        while (!(nextChunk = await reader.read()).done) {
            let partialData = nextChunk.value;
            resultStr += utf8Decoder.decode(partialData);
        }
        
        if(isJsonContent){
            const resultObj = JSON.parse(resultStr);
            if(resultObj.error){
                resultText = resultObj.error;
            }
            else{
                resultText = JSON.stringify(resultObj);
            }
        }
        else{
            resultText = resultStr;
        }
        
        return resultText;
    }
}