"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
/**
* Router
*
* @public
* @class
*/
class Router {
    /**
    * Router Array
    *
    * @protected
    * @type {Route[]}
    */
    routes = [];
    /**
    * Global Handlers
    *
    * @protected
    * @type {RouterHandler[]}
    */
    globalHandlers = [];
    /**
    * Debug Mode
    *
    * @protected
    * @type {boolean}
    */
    debugMode = false;
    /**
    * CORS Config
    *
    * @protected
    * @type {RouterCorsConfig}
    */
    corsConfig = {};
    /**
    * CORS enabled
    *
    * @protected
    * @type {boolean}
    */
    corsEnabled = false;
    /**
    * Register global handlers
    *
    * @param {RouterHandler[]} handlers
    * @returns {Router}
    */
    use(...handlers) {
        for (let handler of handlers) {
            this.globalHandlers.push(handler);
        }
        return this;
    }
    /**
    * Register CONNECT route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    connect(url, ...handlers) {
        return this.register('CONNECT', url, handlers);
    }
    /**
    * Register DELETE route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    delete(url, ...handlers) {
        return this.register('DELETE', url, handlers);
    }
    /**
    * Register GET route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    get(url, ...handlers) {
        return this.register('GET', url, handlers);
    }
    /**
    * Register HEAD route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    head(url, ...handlers) {
        return this.register('HEAD', url, handlers);
    }
    /**
    * Register OPTIONS route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    options(url, ...handlers) {
        return this.register('OPTIONS', url, handlers);
    }
    /**
    * Register PATCH route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    patch(url, ...handlers) {
        return this.register('PATCH', url, handlers);
    }
    /**
    * Register POST route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    post(url, ...handlers) {
        return this.register('POST', url, handlers);
    }
    /**
    * Register PUT route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    put(url, ...handlers) {
        return this.register('PUT', url, handlers);
    }
    /**
    * Register TRACE route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    trace(url, ...handlers) {
        return this.register('TRACE', url, handlers);
    }
    /**
    * Register route, ignoring method
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    any(url, ...handlers) {
        return this.register('*', url, handlers);
    }
    /**
    * Debug Mode
    *
    * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
    * @returns {Router}
    */
    debug(state = true) {
        this.debugMode = state;
        return this;
    }
    /**
    * Enable CORS support
    *
    * @param {RouterCorsConfig} [config]
    * @returns {Router}
    */
    cors(config) {
        this.corsEnabled = true;
        this.corsConfig = {
            allowOrigin: config?.allowOrigin || '*',
            allowMethods: config?.allowMethods || '*',
            allowHeaders: config?.allowHeaders || '*',
            maxAge: config?.maxAge || 86400,
            optionsSuccessStatus: config?.optionsSuccessStatus || 204
        };
        return this;
    }
    /**
    * Register route
    *
    * @private
    * @param {string} method HTTP request method
    * @param {string} url URL String
    * @param {RouterHandler[]} handlers Arrar of handler functions
    * @returns {Router}
    */
    register(method, url, handlers) {
        this.routes.push({
            method,
            url,
            handlers
        });
        return this;
    }
    /**
    * Get Route by request
    *
    * @private
    * @param {RouterRequest} request
    * @returns {Route | undefined}
    */
    getRoute(request) {
        const url = new URL(request.url);
        const pathArr = url.pathname.split('/').filter(i => i);
        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i);
            if (![request.method, '*'].includes(r.method) || routeArr.length !== pathArr.length)
                return false;
            const params = {};
            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== pathArr[i] && routeArr[i][0] !== ':')
                    return false;
                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = pathArr[i];
            }
            request.params = params;
            const query = {};
            for (const [k, v] of url.searchParams.entries()) {
                query[k] = v;
            }
            request.query = query;
            return true;
        }) || this.routes.find(r => r.url === '*' && [request.method, '*'].includes(r.method));
    }
    is_gzip_content(request) {
        const encoding = request.headers.get('content-encoding')?.split(';', 1)[0].trim() ?? '';
        return 'gzip'.includes(encoding);
    }
    is_content_type(request, ...types) {
        const type = request.headers.get('content-type')?.split(';', 1)[0].trim() ?? '';
        return types.includes(type);
    }
    // private is_form_content_type(request: Request): boolean {
    // 	return this.is_content_type(request, 'application/x-www-form-urlencoded', 'multipart/form-data')
    // }
    /**
    * Handle requests
    *
    * @param {TEnv} env
    * @param {Request} request
    * @param {any} [extend]
    * @returns {Promise<Response>}
    */
    async handle(env, request, extend = {}) {
        try {
            const req = {
                ...extend,
                method: request.method,
                headers: request.headers,
                url: request.url,
                cf: request.cf,
                params: {},
                query: {},
                body: ''
            };
            const headers = new Headers();
            const route = this.getRoute(req);
            if (this.corsEnabled) {
                if (this.corsConfig.allowOrigin)
                    headers.set('Access-Control-Allow-Origin', this.corsConfig.allowOrigin);
                if (this.corsConfig.allowMethods)
                    headers.set('Access-Control-Allow-Methods', this.corsConfig.allowMethods);
                if (this.corsConfig.allowHeaders)
                    headers.set('Access-Control-Allow-Headers', this.corsConfig.allowHeaders);
                if (this.corsConfig.maxAge)
                    headers.set('Access-Control-Max-Age', this.corsConfig.maxAge.toString());
                if (!route && req.method === 'OPTIONS') {
                    return new Response(null, {
                        headers,
                        status: this.corsConfig.optionsSuccessStatus
                    });
                }
            }
            if (!route)
                return new Response(this.debugMode ? 'Route not found!' : null, { status: 404 });
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                req.bodyRaw = await request.blob();
                req.body = await req.bodyRaw.text();
                if (this.is_content_type(request, 'application/json')) {
                    try {
                        req.body = JSON.parse(req.body);
                    }
                    catch {
                        req.body = {};
                    }
                }
                if (this.is_gzip_content(request)) {
                    req.body = req.bodyRaw;
                }
            }
            const res = { headers };
            const handlers = [...this.globalHandlers, ...route.handlers];
            let prevIndex = -1;
            const runner = async (index) => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times');
                prevIndex = index;
                if (typeof handlers[index] === 'function')
                    await handlers[index]({ env, req, res, next: async () => await runner(index + 1) });
            };
            await runner(0);
            if (typeof res.body === 'object') {
                if (!res.headers.has('Content-Type'))
                    res.headers.set('Content-Type', 'application/json');
                res.body = JSON.stringify(res.body);
            }
            if (res.raw)
                return res.raw;
            return new Response([101, 204, 205, 304].includes(res.status || (res.body ? 200 : 204)) ? null : res.body, { status: res.status, headers: res.headers, webSocket: res.webSocket || null });
        }
        catch (err) {
            console.error(err);
            return new Response(this.debugMode && err instanceof Error ? err.stack : '', { status: 500 });
        }
    }
}
exports.Router = Router;
