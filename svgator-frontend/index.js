const SVGatorOpener  = require('./src/SVGatorOpener');

class SVGatorFrontend {
    static async auth(appId, redirectUrl, endpoint) {
        if (!endpoint) {
            endpoint = 'https://app.svgator.com/app-auth';
        } else {
            endpoint = endpoint.replace(/\/+$/, '');
        }
        if (!redirectUrl) {
            return await SVGatorOpener.open(appId, endpoint);
        }
        let searchParams = new URLSearchParams();
        searchParams.append('redirect', redirectUrl);
        searchParams.append('appId', appId);
        let url = endpoint + "/connect?" + searchParams.toString();
        return window.open(url, "_self");
    }
}
