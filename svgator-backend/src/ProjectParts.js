const MOVE_POSITIONS = ['before', 'after', 'prepend', 'append'];

class ProjectParts {
    constructor(inst){
        this.inst = inst;
    };

    async get(access_token, project_id, item, options){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        if (!item) {
            throw new Error("item is missing");
        }

        let args = {access_token, project_id, item};

        if (options) {
            if (options.depth !== undefined && options.depth !== null) {
                args.depth = options.depth;
            }
            if (options.fields) {
                args.fields = options.fields;
            }
        }

        return await this.inst.backend.get('/project-part', args);
    }

    /**
     * Overwrite the value at `item` (any target kind: leaf value, property/animator
     * sub-object, element or a keyframe value). The new value is sent in the body.
     */
    async update(access_token, project_id, item, value, options){
        if (value === undefined) {
            throw new Error("value is missing");
        }

        return await this._edit('update', access_token, project_id, item, value, null, options);
    }

    /** Insert a new element as the previous sibling of `item`. */
    async before(access_token, project_id, item, element, options){
        return await this._insert('before', access_token, project_id, item, element, options);
    }

    /** Insert a new element as the next sibling of `item`. */
    async after(access_token, project_id, item, element, options){
        return await this._insert('after', access_token, project_id, item, element, options);
    }

    /** Insert a new element as the first child of the container element `item`. */
    async prepend(access_token, project_id, item, element, options){
        return await this._insert('prepend', access_token, project_id, item, element, options);
    }

    /** Insert a new element as the last child of the container element `item`. */
    async append(access_token, project_id, item, element, options){
        return await this._insert('append', access_token, project_id, item, element, options);
    }

    /** Remove `item` and its whole subtree. */
    async delete(access_token, project_id, item, options){
        return await this._edit('delete', access_token, project_id, item, undefined, null, options);
    }

    /**
     * Relocate the existing `item` element (preserving its id and animators) to
     * `target`/`position`.
     *
     * @param {string} target id-anchored path of the destination anchor element
     * @param {string} position before|after (relative to a sibling target) or
     *                          prepend|append (into a container target)
     */
    async move(access_token, project_id, item, target, position, options){
        if (!target) {
            throw new Error("target is missing");
        }

        if (!MOVE_POSITIONS.includes(position)) {
            throw new Error("position must be one of: " + MOVE_POSITIONS.join(', '));
        }

        return await this._edit('move', access_token, project_id, item, undefined, {target, position}, options);
    }

    /**
     * Shared validation + dispatch for the insert actions; the body must be an
     * element node.
     */
    async _insert(action, access_token, project_id, item, element, options){
        if (!element || typeof element !== 'object') {
            throw new Error("element is missing or not an object");
        }

        return await this._edit(action, access_token, project_id, item, element, null, options);
    }

    /** Shared required-argument guards for every edit call. */
    _assertEditArgs(access_token, project_id, item){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        if (!item) {
            throw new Error("item is missing");
        }
    }

    /**
     * Build and POST a single edit to `[POST] /project-part`.
     *
     * @param {string} action update|before|after|prepend|append|delete|move
     * @param {*} body request payload (new value / new element); undefined for
     *                 delete/move which carry no body
     * @param {object|null} extraArgs extra query params (e.g. target/position for move)
     * @param {object} [options] { preview: 'none'|'image'|'module' }
     */
    async _edit(action, access_token, project_id, item, body, extraArgs, options){
        this._assertEditArgs(access_token, project_id, item);

        let args = {access_token, project_id, item, action};

        if (extraArgs) {
            Object.assign(args, extraArgs);
        }

        if (options && options.preview) {
            args.preview = options.preview;
        }

        return await this.inst.backend.post('/project-part', args, body);
    }
}

module.exports = ProjectParts;
