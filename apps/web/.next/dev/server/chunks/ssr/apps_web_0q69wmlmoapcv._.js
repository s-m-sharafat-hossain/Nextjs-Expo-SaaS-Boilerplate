(()=>{"use strict";module.exports = [
"[project]/apps/web/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "70a25192200c54a576449aa6dbe67053644c1dabd6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendMessageAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)");
}),
"[project]/apps/web/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/src/features/chat-n8n/chat.action.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// apps/web/src/features/chat-n8n/chat.action.ts
/* __next_internal_action_entry_do_not_use__ [{"40f016b0d03f7597c9d982826d4b415ff53220385e":{"name":"getSessionsAction"},"6075711a579fba50178baf6435282007d7d566f5e4":{"name":"getSessionDetailAction"},"60821257a56d6ef09c08bebf0f0750e7cb943fbce8":{"name":"deleteSessionAction"},"70a25192200c54a576449aa6dbe67053644c1dabd6":{"name":"sendMessageAction"}},"apps/web/src/features/chat-n8n/chat.action.ts",""] */ __turbopack_context__.s([
    "deleteSessionAction",
    ()=>deleteSessionAction,
    "getSessionDetailAction",
    ()=>getSessionDetailAction,
    "getSessionsAction",
    ()=>getSessionsAction,
    "sendMessageAction",
    ()=>sendMessageAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function sendMessageAction(input, userId, userRole) {
    try {
        const validated = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendMessageSchema"].parse(input);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatService"].processMessage(validated, userId, userRole);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/consumer/chat");
        return {
            success: true,
            data: result
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Failed to process message with AI assistant"
        };
    }
}
async function getSessionsAction(userId) {
    try {
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionsByUser(userId);
        return {
            success: true,
            data: sessions
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Failed to fetch chat sessions"
        };
    }
}
async function getSessionDetailAction(sessionId, userId) {
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionById(sessionId, userId);
        return {
            success: true,
            data: session
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Failed to fetch session detail"
        };
    }
}
async function deleteSessionAction(sessionId, userId) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].deleteSession(sessionId, userId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/consumer/chat");
        return {
            success: true
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Failed to delete session"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendMessageAction,
    getSessionsAction,
    getSessionDetailAction,
    deleteSessionAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendMessageAction, "70a25192200c54a576449aa6dbe67053644c1dabd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSessionsAction, "40f016b0d03f7597c9d982826d4b415ff53220385e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSessionDetailAction, "6075711a579fba50178baf6435282007d7d566f5e4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteSessionAction, "60821257a56d6ef09c08bebf0f0750e7cb943fbce8", null);
}),
"[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatRepository",
    ()=>ChatRepository
]);
// apps/web/src/features/chat-n8n/chat.repository.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/lib/db.ts [app-rsc] (ecmascript)");
;
class ChatRepository {
    /**
   * Retrieves all chat sessions belonging to a specific user (Tenant Isolation)
   */ static async getSessionsByUser(userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].chatSession.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            include: {
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
    }
    /**
   * Retrieves a specific session with messages, enforcing ownership
   */ static async getSessionById(sessionId, userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].chatSession.findFirst({
            where: {
                id: sessionId,
                ...userId ? {
                    userId
                } : {}
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
    }
    /**
   * Creates a new chat session for a user or anonymous widget visitor
   */ static async createSession(userId, title = "New Health Consultation") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].chatSession.create({
            data: {
                title,
                ...userId ? {
                    userId
                } : {}
            }
        });
    }
    /**
   * Saves a message to a session
   */ static async saveMessage(chatSessionId, role, content) {
        const [message] = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$transaction([
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].message.create({
                data: {
                    chatSessionId,
                    role,
                    content
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].chatSession.update({
                where: {
                    id: chatSessionId
                },
                data: {
                    updatedAt: new Date()
                }
            })
        ]);
        return message;
    }
    /**
   * Deletes a chat session enforcing user isolation
   */ static async deleteSession(sessionId, userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].chatSession.deleteMany({
            where: {
                id: sessionId,
                userId
            }
        });
    }
}
}),
"[project]/apps/web/src/features/chat-n8n/chat.schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSessionSchema",
    ()=>createSessionSchema,
    "n8nWebhookPayloadSchema",
    ()=>n8nWebhookPayloadSchema,
    "sendMessageSchema",
    ()=>sendMessageSchema
]);
// apps/web/src/features/chat-n8n/chat.schema.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .record>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$any$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z .any>");
;
const sendMessageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().cuid().optional(),
    context: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$any$3e$__["z"].any()).optional()
});
const createSessionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100).optional()
});
const n8nWebhookPayloadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().optional(),
    userRole: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().optional(),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string()
});
}),
"[project]/apps/web/src/features/chat-n8n/chat.service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatService",
    ()=>ChatService
]);
// apps/web/src/features/chat-n8n/chat.service.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/config/master.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/error-handler.ts [app-rsc] (ecmascript)");
;
;
;
;
class ChatService {
    /**
   * Main messaging pipeline: persists user message, deducts credits, proxies to n8n or fallback AI
   */ static async processMessage(input, userId, userRole) {
        let sessionId = input.sessionId;
        // 1. Ensure valid session exists
        if (!sessionId) {
            const newSession = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].createSession(userId, "Clinical Consultation");
            sessionId = newSession.id;
        } else {
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionById(sessionId, userId);
            if (!existing) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppError"]("Chat session not found or unauthorized", 404);
            }
        }
        // 2. Pre-action credit check (for logged-in users)
        if (userId) {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    credits: true
                }
            });
            const cost = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["siteConfig"].rewards.creditCostPerAiAction;
            if (user && user.credits < cost) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppError"](`Insufficient credits. This AI operation requires ${cost} credits. Please upgrade your plan or top up.`, 402);
            }
            // Deduct credits atomically
            await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$transaction([
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        credits: {
                            decrement: cost
                        }
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].usageLog.create({
                    data: {
                        userId,
                        action: "ai_chat",
                        creditsUsed: cost,
                        metadata: JSON.stringify({
                            sessionId,
                            promptLength: input.message.length
                        })
                    }
                })
            ]);
        }
        // 3. Persist User Message
        await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].saveMessage(sessionId, "user", input.message);
        // 4. Dispatch to n8n Webhook or Intelligent Clinical Fallback
        let assistantReply = "";
        const n8nConfig = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["siteConfig"].n8n;
        if (n8nConfig.enabled && n8nConfig.webhookUrl && !n8nConfig.webhookUrl.includes("yourdomain")) {
            try {
                const response = await fetch(n8nConfig.webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-n8n-secret": n8nConfig.secretToken
                    },
                    body: JSON.stringify({
                        sessionId,
                        message: input.message,
                        userId: userId ?? "anonymous-visitor",
                        userRole: userRole ?? "CONSUMER",
                        timestamp: new Date().toISOString()
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    assistantReply = data.output || data.text || data.message || "Thank you. Your request has been processed.";
                }
            } catch (err) {
                console.warn("⚠️ n8n webhook proxy unavailable, activating portfolio fallback AI:", err);
            }
        }
        // 5. Portfolio Demo Fallback Engine (when n8n is offline or unconfigured)
        if (!assistantReply) {
            assistantReply = this.generateFallbackResponse(input.message);
        }
        // 6. Persist Assistant Reply
        const savedAssistantMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatRepository"].saveMessage(sessionId, "assistant", assistantReply);
        return {
            sessionId,
            message: savedAssistantMessage,
            remainingCredits: userId ? (await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    credits: true
                }
            }))?.credits : null
        };
    }
    /**
   * Helper fallback when live n8n webhook is not yet deployed
   */ static generateFallbackResponse(userPrompt) {
        const prompt = userPrompt.toLowerCase();
        if (prompt.includes("appointment") || prompt.includes("book") || prompt.includes("doctor")) {
            return "I can certainly help you book an appointment! Dr. Sarah Mitchell is currently accepting " + "virtual consultations. You can view her available calendar slots directly from the 'Find & Book Doctor' " + "tab or click into the Provider Directory. Would you like me to guide you to her scheduling page?";
        }
        if (prompt.includes("cost") || prompt.includes("price") || prompt.includes("fee") || prompt.includes("payment")) {
            return "Standard telemedicine consultations start at $80 for a 30-minute second opinion and $120 for a " + "comprehensive clinical evaluation. We support Stripe, PayPal, bKash, and manual bank transfers with automatic split " + "calculation and instant receipt generation.";
        }
        if (prompt.includes("symptom") || prompt.includes("fever") || prompt.includes("headache") || prompt.includes("pain")) {
            return "I've noted your symptoms. While I can assist with general triage information, this is an automated " + "pre-assessment. For acute or severe discomfort, please book an immediate consultation with one of our verified " + "physicians on the portal or visit the nearest emergency care facility.";
        }
        return `Hello! I am your AI Health & Scheduling Assistant powered by n8n and our enterprise MVC architecture. ` + `I can help you review symptoms, find qualified doctors, manage appointments, and check your invoice receipts. ` + `How can I assist your health journey today?`;
    }
}
}),
"[project]/apps/web/src/shared/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "prisma",
    ()=>prisma,
    "testDatabaseConnection",
    ()=>testDatabaseConnection
]);
// src/shared/lib/db.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = db;
}
const prisma = db;
async function testDatabaseConnection() {
    const start = performance.now();
    try {
        await db.$queryRaw`SELECT 1`;
        const latencyMs = Math.round(performance.now() - start);
        return {
            connected: true,
            latencyMs
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown database error";
        return {
            connected: false,
            latencyMs: 0,
            error: message
        };
    }
}
}),
"[project]/apps/web/src/shared/utils/api-response.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiResponse",
    ()=>ApiResponse
]);
// src/shared/utils/api-response.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-rsc] (ecmascript)");
;
class ApiResponse {
    static success(data, message = "Success", statusCode = 200, meta) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            statusCode,
            message,
            data,
            ...meta ? {
                meta
            } : {}
        }, {
            status: statusCode
        });
    }
    static error(message = "Internal Server Error", statusCode = 500, errors) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            statusCode,
            message,
            ...errors !== undefined && errors !== null ? {
                errors
            } : {}
        }, {
            status: statusCode
        });
    }
}
}),
"[project]/apps/web/src/shared/utils/error-handler.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/shared/utils/error-handler.ts
__turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "asyncHandler",
    ()=>asyncHandler,
    "handleApiError",
    ()=>handleApiError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/api-response.ts [app-rsc] (ecmascript)");
;
;
class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 400){
        super(message), this.message = message, this.statusCode = statusCode;
    }
}
const asyncHandler = (fn)=>{
    return async (req, context)=>{
        try {
            return await fn(req, context);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZodError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error("Validation Failed", 422, error.flatten().fieldErrors);
            }
            if (error instanceof AppError) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error(error.message, error.statusCode);
            }
            console.error("[GLOBAL_ERROR]:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error("Something went wrong on the server", 500);
        }
    };
};
function handleApiError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZodError"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error("Validation Failed", 422, error.flatten().fieldErrors);
    }
    if (error instanceof AppError) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiResponse"].error(message, 500);
}
}),
];})()

//# sourceMappingURL=apps_web_0q69wmlmoapcv._.js.map