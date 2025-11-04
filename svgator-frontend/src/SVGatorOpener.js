/**
 * @author Tibor Vincze
 * @date 10/1/2020 11:38 AM
 */

class SVGatorOpener {
    static windowOptions() {
        let opts = {
            top: 100,
            left: 100,
            width: 500,
            height: 700,
            menu: 0
        };

        return Object.keys(opts).map(name => name + '=' + opts[name]).join(',');
    }

    static async getOauth(appId, endpoint) {
        let url = endpoint + '/api/svgator/oauth'
            + '?action=create&appId=' + encodeURIComponent(appId)
        const result = await fetch(url);
        return await result.json();
    }

    static async waitOauth(appId, endpoint, oauth_id, timeout) {
        const startTime = new Date().getTime();
        let lastResponse = null;
        do {
            const elapsedTime = (new Date().getTime() - startTime) / 1000;
            const leftTime = Math.max(0, Math.round(timeout - elapsedTime));
            let url = endpoint + '/api/svgator/oauth?action=read' + '&oauthId=' + encodeURIComponent(oauth_id);
            if (appId) {
                url += '&appId=' + encodeURIComponent(appId);
            }
            if (leftTime > 0) {
                url += '&timeout=' + leftTime;
            }
            try {
                const result = await fetch(url);
                lastResponse = await result.json();
            } catch(e) {

            }
        } while (
                new Date().getTime() - startTime < timeout * 1000
                && lastResponse?.status === 'pending'
            )
        return lastResponse;
    }

    static open(appId, endpoint, oauth_writer) {
        return new Promise(function(resolve, reject) {
            let windowWatcher;
            let msgSent = false;
            function success(msg) {
                if (msgSent) {
                    return;
                }
                msgSent = true;
                if (windowWatcher) {
                    clearInterval(windowWatcher);
                    windowWatcher = false;
                }
                setTimeout(function() {
                    resolve(msg);
                }, 0);
            }

            function fail(data) {
                if (msgSent) {
                    return;
                }
                msgSent = true;
                if (windowWatcher) {
                    clearInterval(windowWatcher);
                    windowWatcher = false;
                }
                setTimeout(function() {
                    reject(data);
                }, 0);
            }

            try {
                let url = endpoint + '/connect'
                    + '?appId=' + encodeURIComponent(appId)
                    + '&origin=' + encodeURIComponent(window.origin);
                if (oauth_writer) {
                    url += '&oauth_writer=' + encodeURIComponent(oauth_writer);
                }
                let w = window.open(url, '_blank', SVGatorOpener.windowOptions());

                if (oauth_writer) {
                    success("Process started");
                }

                windowWatcher = setInterval(function() {
                    if (!w || w.closed) {
                        fail({code: -4, msg: "Authorization page closed"});
                    }
                }, 100);

                window.addEventListener('message', function(ev) {
                    let data
                    try {
                        data = JSON.parse(ev.data);
                    } catch(err) {
                        return;
                    }
                    if (!data || (!data.code && !data.msg)) {
                        return;
                    }
                    try {
                        if (!data.code) {
                            success(data.msg);
                        } else {
                            fail(data);
                        }
                    } catch(err) {
                        fail({code: -2, msg: err});
                    }
                });
            } catch(err) {
                fail({code: -1, msg: err});
            }
        })
    }
}

module.exports = SVGatorOpener;
