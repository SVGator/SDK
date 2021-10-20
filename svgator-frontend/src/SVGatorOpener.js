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

    static open(appId, endpoint) {
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
                let w = window.open(url, '_blank', SVGatorOpener.windowOptions());

                windowWatcher = setInterval(function() {
                    if (!w || w.closed) {
                        fail({code: -4, msg: "Authorization page closed"});
                    }
                }, 100);

                window.addEventListener('message', function(ev) {
                    try {
                        let data = JSON.parse(ev.data);
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