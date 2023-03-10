/// <reference types="@cloudflare/workers-types" />
/**
* Route Object
*
* @typedef Route
* @property {string} method HTTP request method
* @property {string} url URL String
* @property {RouterHandler[]} handlers Array of handler functions
*/
export interface Route<TEnv> {
    method: string;
    url: string;
    handlers: RouterHandler<TEnv>[];
}
/**
* Router Context
*
* @typedef RouterContext
* @property {RouterEnv} env Environment
* @property {RouterRequest} req Request Object
* @property {RouterResponse} res Response Object
* @property {RouterNext} next Next Handler
*/
export interface RouterContext<TEnv> {
    env: TEnv;
    req: RouterRequest;
    res: RouterResponse;
    next: RouterNext;
}
/**
* Request Object
*
* @typedef RouterRequest
* @property {string} url URL
* @property {string} method HTTP request method
* @property {RouterRequestParams} params Object containing all parameters defined in the url string
* @property {RouterRequestQuery} query Object containing all query parameters
* @property {Headers} headers Request headers object
* @property {string | any} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
* @property {IncomingRequestCfProperties} [cf] object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
*/
export interface RouterRequest {
    url: string;
    method: string;
    params: RouterRequestParams;
    query: RouterRequestQuery;
    headers: Headers;
    body: string | any;
    bodyRaw: Blob | any;
    cf?: IncomingRequestCfProperties;
    [key: string]: any;
}
/**
* Request Parameters
*
* @typedef RouterRequestParams
*/
export interface RouterRequestParams {
    [key: string]: string;
}
/**
* Request Query
*
* @typedef RouterRequestQuery
*/
export interface RouterRequestQuery {
    [key: string]: string;
}
/**
* Response Object
*
* @typedef RouterResponse
* @property {Headers} headers Response headers object
* @property {number} [status=204] Return status code (default: `204`)
* @property {string | any} [body] Either an `object` (will be converted to JSON) or a string
* @property {Response} [raw] A response object that is to be returned, this will void all other res properties and return this as is.
*/
export interface RouterResponse {
    headers: Headers;
    status?: number;
    body?: string | any;
    raw?: Response;
    webSocket?: WebSocket;
}
/**
* Next Function
*
* @callback RouterNext
* @returns {Promise<void>}
*/
export interface RouterNext {
    (): Promise<void>;
}
/**
* Handler Function
*
* @callback RouterHandler
* @param {RouterContext} ctx
* @returns {Promise<void> | void}
*/
export interface RouterHandler<TEnv = any> {
    (ctx: RouterContext<TEnv>): Promise<void> | void;
}
/**
* CORS Config
*
* @typedef RouterCorsConfig
* @property {string} [allowOrigin="*"] Access-Control-Allow-Origin (default: `*`)
* @property {string} [allowMethods="*"] Access-Control-Allow-Methods (default: `*`)
* @property {string} [allowHeaders="*"] Access-Control-Allow-Headers (default: `*`)
* @property {number} [maxAge=86400] Access-Control-Max-Age (default: `86400`)
* @property {number} [optionsSuccessStatus=204] Return status code for OPTIONS request (default: `204`)
*/
export interface RouterCorsConfig {
    allowOrigin?: string;
    allowMethods?: string;
    allowHeaders?: string;
    maxAge?: number;
    optionsSuccessStatus?: number;
}
/**
* Router
*
* @public
* @class
*/
export declare class Router<TEnv = any> {
    /**
    * Router Array
    *
    * @protected
    * @type {Route[]}
    */
    protected routes: Route<TEnv>[];
    /**
    * Global Handlers
    *
    * @protected
    * @type {RouterHandler[]}
    */
    protected globalHandlers: RouterHandler<TEnv>[];
    /**
    * Debug Mode
    *
    * @protected
    * @type {boolean}
    */
    protected debugMode: boolean;
    /**
    * CORS Config
    *
    * @protected
    * @type {RouterCorsConfig}
    */
    protected corsConfig: RouterCorsConfig;
    /**
    * CORS enabled
    *
    * @protected
    * @type {boolean}
    */
    protected corsEnabled: boolean;
    /**
    * Register global handlers
    *
    * @param {RouterHandler[]} handlers
    * @returns {Router}
    */
    use(...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register CONNECT route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    connect(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register DELETE route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    delete(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register GET route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    get(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register HEAD route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    head(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register OPTIONS route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    options(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register PATCH route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    patch(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register POST route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    post(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register PUT route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    put(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register TRACE route
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    trace(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Register route, ignoring method
    *
    * @param {string} url
    * @param  {RouterHandler[]} handlers
    * @returns {Router}
    */
    any(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv>;
    /**
    * Debug Mode
    *
    * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
    * @returns {Router}
    */
    debug(state?: boolean): Router<TEnv>;
    /**
    * Enable CORS support
    *
    * @param {RouterCorsConfig} [config]
    * @returns {Router}
    */
    cors(config?: RouterCorsConfig): Router<TEnv>;
    /**
    * Register route
    *
    * @private
    * @param {string} method HTTP request method
    * @param {string} url URL String
    * @param {RouterHandler[]} handlers Arrar of handler functions
    * @returns {Router}
    */
    private register;
    /**
    * Get Route by request
    *
    * @private
    * @param {RouterRequest} request
    * @returns {Route | undefined}
    */
    private getRoute;
    private is_gzip_content;
    private is_content_type;
    /**
    * Handle requests
    *
    * @param {TEnv} env
    * @param {Request} request
    * @param {any} [extend]
    * @returns {Promise<Response>}
    */
    handle(env: TEnv, request: Request, extend?: any): Promise<Response>;
}
