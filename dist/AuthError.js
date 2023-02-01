"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    constructor(msg) {
        super(msg);
        this.isAuthError = true;
    }
}
exports.AuthError = AuthError;
//# sourceMappingURL=AuthError.js.map