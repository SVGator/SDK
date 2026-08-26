const SVGatorOpener  = require('./src/SVGatorOpener');

class SVGatorFrontend {
    static async auth(appId, redirectUrl, endpoint, appName = null) {
        if (!endpoint) {
            endpoint = 'https://app.svgator.com/app-auth';
        } else {
            endpoint = endpoint.replace(/\/+$/, '');
        }
        if (!redirectUrl) {
            return await SVGatorOpener.open(appId, endpoint, null, appName);
        }
        let searchParams = new URLSearchParams();
        searchParams.append('redirect', redirectUrl);
        searchParams.append('appId', appId);
        if (appName) {
            searchParams.append('app_name', appName);
        }
        let url = endpoint + "/connect?" + searchParams.toString();
        return window.open(url, "_self");
    }

    static async oauth(appId, endpoint, timeout = 300, appName = null) {
        if (!endpoint) {
            endpoint = 'https://app.svgator.com';
        } else {
            endpoint = endpoint.replace(/\/+$/, '');
        }
        const result = await SVGatorOpener.getOauth(appId, endpoint);
        if (!result?.oauth?.writer) {
            throw new Error(`Unable to initiate oauth!`);
        }
        const {oauth} = result;

        await SVGatorOpener.open(appId, endpoint + '/app-auth', oauth.writer, appName);
        return await SVGatorOpener.waitOauth(appId, endpoint, oauth.id, timeout);
    }
}

module.exports = SVGatorFrontend;
