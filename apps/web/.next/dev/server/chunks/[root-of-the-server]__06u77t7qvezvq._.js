module.exports = [
(()=>{"use strict";return[
"[project]/apps/web/src/app/api/v1/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// apps/web/src/app/api/v1/chat/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$controller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.controller.ts [app-route] (ecmascript)");
;
const POST = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$controller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatController"].sendMessage;
const GET = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$controller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatController"].listSessions;
}),
"[project]/apps/web/src/features/chat-n8n/chat.controller.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// apps/web/src/features/chat-n8n/chat.controller.ts
__turbopack_context__.s([
    "ChatController",
    ()=>ChatController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/error-handler.ts [app-route] (ecmascript)");
;
;
;
;
;
class ChatController {
    /**
   * POST /api/v1/chat
   * Dispatches a message to n8n webhook or AI triage
   */ static sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asyncHandler"])(async (req)=>{
        const userId = req.headers.get("x-user-id") || undefined;
        const userRole = req.headers.get("x-user-role") || "CONSUMER";
        const body = await req.json();
        const validated = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendMessageSchema"].parse(body);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatService"].processMessage(validated, userId, userRole);
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(result, "AI message processed successfully", 200);
    });
    /**
   * GET /api/v1/chat/sessions
   * Lists all sessions for the authenticated user / mobile client
   */ static listSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asyncHandler"])(async (req)=>{
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error("Authentication required to list chat history", 401);
        }
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionsByUser(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(sessions, "Chat sessions retrieved successfully");
    });
    /**
   * GET /api/v1/chat/sessions/[id]
   * Gets specific session with message history
   */ static getSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asyncHandler"])(async (req, { params })=>{
        const userId = req.headers.get("x-user-id") || undefined;
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionById(params.id, userId);
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error("Chat session not found", 404);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(session, "Chat session details retrieved");
    });
}
}),
"[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatRepository",
    ()=>ChatRepository
]);
// apps/web/src/features/chat-n8n/chat.repository.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/lib/db.ts [app-route] (ecmascript)");
;
class ChatRepository {
    /**
   * Retrieves all chat sessions belonging to a specific user (Tenant Isolation)
   */ static async getSessionsByUser(userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].chatSession.findMany({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].chatSession.findFirst({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].chatSession.create({
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
        const [message] = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].message.create({
                data: {
                    chatSessionId,
                    role,
                    content
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].chatSession.update({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].chatSession.deleteMany({
            where: {
                id: sessionId,
                userId
            }
        });
    }
}
}),
"[project]/apps/web/src/features/chat-n8n/chat.schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .record>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$any$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .any>");
;
const sendMessageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().cuid().optional(),
    context: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$record$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$any$3e$__["z"].any()).optional()
});
const createSessionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(100).optional()
});
const n8nWebhookPayloadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().optional(),
    userRole: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().optional(),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string()
});
}),
"[project]/apps/web/src/features/chat-n8n/chat.service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatService",
    ()=>ChatService
]);
// apps/web/src/features/chat-n8n/chat.service.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/features/chat-n8n/chat.repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/config/master.config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/error-handler.ts [app-route] (ecmascript)");
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
            const newSession = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].createSession(userId, "Clinical Consultation");
            sessionId = newSession.id;
        } else {
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].getSessionById(sessionId, userId);
            if (!existing) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]("Chat session not found or unauthorized", 404);
            }
        }
        // 2. Pre-action credit check (for logged-in users)
        if (userId) {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    credits: true
                }
            });
            const cost = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteConfig"].rewards.creditCostPerAiAction;
            if (user && user.credits < cost) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](`Insufficient credits. This AI operation requires ${cost} credits. Please upgrade your plan or top up.`, 402);
            }
            // Deduct credits atomically
            await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        credits: {
                            decrement: cost
                        }
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].usageLog.create({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].saveMessage(sessionId, "user", input.message);
        // 4. Dispatch to n8n Webhook or Intelligent Clinical Fallback
        let assistantReply = "";
        const n8nConfig = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteConfig"].n8n;
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
        const savedAssistantMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$features$2f$chat$2d$n8n$2f$chat$2e$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatRepository"].saveMessage(sessionId, "assistant", assistantReply);
        return {
            sessionId,
            message: savedAssistantMessage,
            remainingCredits: userId ? (await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
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
"[project]/apps/web/src/shared/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/apps/web/src/shared/utils/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiResponse",
    ()=>ApiResponse
]);
// src/shared/utils/api-response.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
class ApiResponse {
    static success(data, message = "Success", statusCode = 200, meta) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
"[project]/apps/web/src/shared/utils/error-handler.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/api-response.ts [app-route] (ecmascript)");
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
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error("Validation Failed", 422, error.flatten().fieldErrors);
            }
            if (error instanceof AppError) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error(error.message, error.statusCode);
            }
            console.error("[GLOBAL_ERROR]:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error("Something went wrong on the server", 500);
        }
    };
};
function handleApiError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZodError"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error("Validation Failed", 422, error.flatten().fieldErrors);
    }
    if (error instanceof AppError) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error(message, 500);
}
}),
"[project]/packages/shared/config/master.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/shared/config/master.config.ts
__turbopack_context__.s([
    "appConfig",
    ()=>appConfig,
    "designConfig",
    ()=>designConfig,
    "masterConfig",
    ()=>masterConfig,
    "paymentConfig",
    ()=>paymentConfig,
    "siteConfig",
    ()=>siteConfig,
    "themeConfig",
    ()=>themeConfig
]);
const masterConfig = {
    // 1. BRAND IDENTITY
    brand: {
        name: "MasterFlow SaaS",
        shortName: "MasterFlow",
        niche: "telemedicine-doctor",
        description: "Enterprise Production-Ready SaaS & Marketplace Boilerplate with Three-Portal Architecture",
        url: typeof process !== "undefined" && ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000",
        ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
        favicon: "/favicon.ico",
        logo: {
            light: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            dark: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            square: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80"
        }
    },
    // 2. DYNAMIC ROLE TERMINOLOGY & BRANDING
    roleLabels: {
        admin: {
            key: "ADMIN",
            singular: "Admin",
            plural: "Super Admins",
            badge: "Platform Administrator",
            badgeColor: "#6366f1",
            portalTitle: "Platform Governance Portal",
            portalPath: "/admin",
            description: "Platform Governance & Compliance"
        },
        provider: {
            key: "PROVIDER",
            singular: "Doctor",
            plural: "Doctors",
            badge: "Verified Practitioner",
            badgeColor: "#0ea5e9",
            portalTitle: "Doctor Practice Portal",
            portalPath: "/provider",
            description: "Consultation & Service Fulfillment",
            serviceUnitName: "Consultation / Service",
            earningsUnitName: "Consultation Fees"
        },
        consumer: {
            key: "CONSUMER",
            singular: "Patient",
            plural: "Patients",
            badge: "Verified Client",
            badgeColor: "#10b981",
            portalTitle: "Patient Health Portal",
            portalPath: "/consumer",
            description: "Service Discovery & Booking",
            bookingUnitName: "Appointment / Order"
        }
    },
    // 3. DESIGN TOKENS (Colors, Typography, Radii, Shadows)
    design: {
        // Theme modes
        theme: {
            defaultTheme: "light",
            enableSystem: true,
            storageKey: "masterflow-theme-mode"
        },
        colors: {
            brand: {
                primary: {
                    light: "#2563eb",
                    dark: "#3b82f6",
                    hover: "#1d4ed8",
                    subtle: "rgba(37, 99, 235, 0.08)",
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a"
                },
                secondary: {
                    light: "#7c3aed",
                    dark: "#8b5cf6",
                    hover: "#6d28d9",
                    subtle: "rgba(124, 58, 237, 0.08)"
                },
                accent: {
                    light: "#06b6d4",
                    dark: "#22d3ee",
                    hover: "#0891b2"
                }
            },
            status: {
                success: {
                    light: "#16a34a",
                    dark: "#22c55e",
                    subtle: "rgba(34, 197, 94, 0.12)"
                },
                warning: {
                    light: "#d97706",
                    dark: "#f59e0b",
                    subtle: "rgba(245, 158, 11, 0.12)"
                },
                error: {
                    light: "#dc2626",
                    dark: "#ef4444",
                    subtle: "rgba(239, 68, 68, 0.12)"
                },
                info: {
                    light: "#0284c7",
                    dark: "#38bdf8",
                    subtle: "rgba(56, 189, 248, 0.12)"
                }
            },
            surface: {
                background: {
                    light: "#f8fafc",
                    dark: "#080c14"
                },
                card: {
                    light: "#ffffff",
                    dark: "#111827"
                },
                popover: {
                    light: "#ffffff",
                    dark: "#1e293b"
                },
                border: {
                    light: "#e2e8f0",
                    dark: "#1f2937"
                },
                muted: {
                    light: "#f1f5f9",
                    dark: "#1e293b"
                }
            },
            text: {
                primary: {
                    light: "#0f172a",
                    dark: "#f8fafc"
                },
                secondary: {
                    light: "#475569",
                    dark: "#94a3b8"
                },
                muted: {
                    light: "#94a3b8",
                    dark: "#64748b"
                }
            }
        },
        radii: {
            none: 0,
            xs: 4,
            sm: 8,
            md: 12,
            lg: 16,
            xl: 20,
            "2xl": 24,
            full: 9999
        },
        typography: {
            fontSans: "var(--font-inter), system-ui, -apple-system, sans-serif",
            fontHeading: "var(--font-inter), system-ui, -apple-system, sans-serif",
            fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            mobile: {
                display: {
                    fontSize: 32,
                    lineHeight: 40,
                    fontWeight: "800"
                },
                h1: {
                    fontSize: 24,
                    lineHeight: 32,
                    fontWeight: "700"
                },
                h2: {
                    fontSize: 20,
                    lineHeight: 28,
                    fontWeight: "700"
                },
                h3: {
                    fontSize: 18,
                    lineHeight: 24,
                    fontWeight: "600"
                },
                h4: {
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: "600"
                },
                body: {
                    fontSize: 15,
                    lineHeight: 22,
                    fontWeight: "400"
                },
                bodyMedium: {
                    fontSize: 15,
                    lineHeight: 22,
                    fontWeight: "500"
                },
                caption: {
                    fontSize: 13,
                    lineHeight: 18,
                    fontWeight: "400"
                },
                tiny: {
                    fontSize: 11,
                    lineHeight: 14,
                    fontWeight: "500"
                }
            }
        },
        spacing: {
            0: "0px",
            1: "0.25rem",
            2: "0.5rem",
            3: "0.75rem",
            4: "1rem",
            5: "1.25rem",
            6: "1.5rem",
            8: "2rem",
            10: "2.5rem",
            12: "3rem",
            16: "4rem"
        },
        shadows: {
            subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
            card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
            modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }
    },
    // 4. CURRENCY & BILLING SETTINGS
    currency: {
        code: "USD",
        symbol: "$",
        taxPercentage: 5
    },
    commissionPercentage: 15,
    billing: {
        currency: {
            code: "USD",
            symbol: "$"
        },
        taxPercentage: 5,
        platformCommissionPercent: 15
    },
    // 5. PAYMENT GATEWAYS CONFIGURATION
    payment: {
        defaultGateway: "STRIPE",
        enabledGateways: [
            "STRIPE",
            "PAYPAL",
            "SSLCOMMERZ",
            "BKASH",
            "RAZORPAY",
            "PAYSTACK",
            "MANUAL_BANK"
        ],
        supportedGateways: [
            {
                id: "STRIPE",
                name: "Credit/Debit Card (Stripe)",
                icon: "credit-card",
                isDirect: true
            },
            {
                id: "PAYPAL",
                name: "PayPal Express",
                icon: "wallet",
                isDirect: true
            },
            {
                id: "BKASH",
                name: "bKash Mobile Wallet",
                icon: "smartphone",
                isDirect: false
            },
            {
                id: "SSLCOMMERZ",
                name: "SSLCommerz Multi-Bank",
                icon: "shield-check",
                isDirect: true
            },
            {
                id: "MANUAL_BANK",
                name: "Direct Bank Wire",
                icon: "building",
                isDirect: false
            }
        ],
        manualPaymentInstructions: "Send payment to Bank Account / bKash / USDT TRC20 Wallet and submit your Transaction ID (TrxID) for instant admin verification."
    },
    // 6. API ENDPOINTS CONFIGURATION
    api: {
        baseUrl: typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
        endpoints: {
            auth: {
                login: "/auth/login",
                register: "/auth/register",
                demo: "/auth/demo",
                twoFactor: "/auth/2fa"
            },
            admin: {
                stats: "/admin/stats",
                users: "/admin/users",
                kyc: "/admin/kyc",
                payouts: "/admin/payouts",
                transactions: "/admin/transactions"
            },
            provider: {
                stats: "/provider/stats",
                services: "/provider/services",
                bookings: "/provider/bookings",
                schedule: "/provider/schedule",
                payouts: "/provider/payouts"
            },
            consumer: {
                stats: "/consumer/stats",
                explore: "/consumer/explore",
                bookings: "/consumer/bookings",
                reviews: "/consumer/reviews"
            },
            billing: {
                checkout: "/billing/checkout",
                transactions: "/billing/transactions",
                manualTrx: "/billing/manual-trx"
            },
            chat: "/chat",
            ai: "/ai/generate",
            health: "/health"
        }
    },
    // 7. FEATURE FLAGS
    features: {
        aiEngineEnabled: true,
        n8nIntegrationEnabled: true,
        multiRolePortalEnabled: true,
        biometricsEnabled: true,
        manualBankPaymentsEnabled: true,
        pushNotificationsEnabled: true,
        darkLightToggleEnabled: true
    },
    // 8. MOBILE-SPECIFIC SETTINGS
    mobile: {
        tabBarStyle: "standard",
        animation: {
            springConfig: {
                damping: 18,
                stiffness: 180,
                mass: 0.8
            },
            defaultDurationMs: 250
        },
        pagination: {
            defaultLimit: 15,
            maxLimit: 50
        },
        links: {
            privacyPolicy: "https://masterflow.io/privacy",
            termsOfService: "https://masterflow.io/terms",
            supportEmail: "support@masterflow.io"
        }
    },
    // 9. WEB-SPECIFIC SETTINGS
    web: {
        layout: {
            sidebar: {
                desktopWidth: "260px",
                tabletCollapsedWidth: "72px",
                mobileDrawerWidth: "280px"
            },
            topHeaderHeight: "64px",
            contentMaxWidth: "1400px"
        }
    },
    // 10. REWARDS, I18N, N8N, DEMO ACCOUNTS & PRICING PLANS
    i18n: {
        defaultLocale: "en",
        locales: [
            "en",
            "bn",
            "ar",
            "es"
        ],
        isRTL: false
    },
    rewards: {
        welcomeFreeCredits: 25,
        referralBonusCredits: 20,
        creditCostPerAiAction: 2
    },
    n8n: {
        enabled: true,
        webhookUrl: typeof process !== "undefined" && process.env?.N8N_WEBHOOK_URL || "https://n8n.yourdomain.com/webhook/chat",
        secretToken: typeof process !== "undefined" && process.env?.N8N_SECRET_TOKEN || "default-secret-token",
        maxHistoryMessages: 12
    },
    demoAccounts: [
        {
            role: "ADMIN",
            email: "admin@demo.com",
            label: "Login as Super Admin",
            description: "Full platform governance, KYC approvals, and financial ledger",
            path: "/admin"
        },
        {
            role: "PROVIDER",
            email: "provider@demo.com",
            label: "Login as Provider (Doctor/Vendor)",
            description: "Services, scheduling, calendar, and earnings wallet",
            path: "/provider"
        },
        {
            role: "CONSUMER",
            email: "user@demo.com",
            label: "Login as Consumer (Patient/User)",
            description: "Browse marketplace, book appointments, and track orders",
            path: "/consumer"
        }
    ],
    plans: [
        {
            id: "starter",
            name: "Starter Tier",
            price: 29,
            credits: 100,
            period: "monthly",
            popular: false,
            features: [
                "100 AI Automation Credits",
                "Up to 2 Workspaces",
                "Standard Multi-Gateway Checkout",
                "Email Support"
            ]
        },
        {
            id: "pro",
            name: "Professional Tier",
            price: 79,
            credits: 500,
            period: "monthly",
            popular: true,
            features: [
                "500 AI Automation Credits",
                "Unlimited Workspaces & Team Seats",
                "Provider Commission Split Engine",
                "Priority 24/7 Support",
                "Advanced Analytics & PDF Receipts"
            ]
        },
        {
            id: "enterprise",
            name: "Enterprise Tier",
            price: 199,
            credits: 2500,
            period: "monthly",
            popular: false,
            features: [
                "2,500 AI Automation Credits",
                "Full n8n Dedicated Webhook Tunnel",
                "Custom White-Label Domain & Branding",
                "Dedicated VIP Account Manager",
                "Custom Gateway & Escrow Settlement"
            ]
        }
    ]
};
const siteConfig = {
    name: masterConfig.brand.name,
    shortName: masterConfig.brand.shortName,
    niche: masterConfig.brand.niche,
    description: masterConfig.brand.description,
    url: masterConfig.brand.url,
    ogImage: masterConfig.brand.ogImage,
    roleLabels: masterConfig.roleLabels,
    i18n: masterConfig.i18n,
    currency: masterConfig.currency,
    billing: masterConfig.billing,
    payment: masterConfig.payment,
    rewards: masterConfig.rewards,
    n8n: masterConfig.n8n,
    demoAccounts: masterConfig.demoAccounts,
    plans: masterConfig.plans
};
const designConfig = {
    theme: masterConfig.design.theme,
    colors: masterConfig.design.colors,
    typography: masterConfig.design.typography,
    radius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        pill: "9999px"
    },
    shadows: masterConfig.design.shadows,
    layout: masterConfig.web.layout
};
const themeConfig = {
    colors: {
        primary: masterConfig.design.colors.brand.primary,
        light: {
            background: "#f8fafc",
            surface: "#ffffff",
            card: "#ffffff",
            cardSubtle: "#f1f5f9",
            border: "#e2e8f0",
            borderStrong: "#cbd5e1",
            textPrimary: "#0f172a",
            textSecondary: "#64748b",
            textMuted: "#94a3b8",
            inputBackground: "#f8fafc",
            headerBackground: "rgba(255, 255, 255, 0.95)",
            tabBarBackground: "#ffffff"
        },
        dark: {
            background: "#080c14",
            surface: "#0f172a",
            card: "#111827",
            cardSubtle: "#1e293b",
            border: "#1e293b",
            borderStrong: "#334155",
            textPrimary: "#f8fafc",
            textSecondary: "#94a3b8",
            textMuted: "#64748b",
            inputBackground: "#0d1322",
            headerBackground: "rgba(11, 15, 25, 0.95)",
            tabBarBackground: "#0b0f19"
        },
        status: {
            success: "#10b981",
            successLight: "rgba(16, 185, 129, 0.15)",
            warning: "#f59e0b",
            warningLight: "rgba(245, 158, 11, 0.15)",
            danger: "#ef4444",
            dangerLight: "rgba(239, 68, 68, 0.15)",
            info: "#0ea5e9",
            infoLight: "rgba(14, 165, 233, 0.15)"
        }
    },
    radii: masterConfig.design.radii,
    typography: masterConfig.design.typography.mobile,
    tabBarStyle: masterConfig.mobile.tabBarStyle,
    animation: masterConfig.mobile.animation
};
const appConfig = {
    name: masterConfig.brand.name,
    shortName: masterConfig.brand.shortName,
    description: masterConfig.brand.description,
    defaultCurrency: masterConfig.currency.code,
    currencySymbol: masterConfig.currency.symbol,
    defaultLocale: masterConfig.i18n.defaultLocale,
    roleLabels: masterConfig.roleLabels,
    supportedGateways: masterConfig.payment.supportedGateways,
    pagination: masterConfig.mobile.pagination,
    links: masterConfig.mobile.links
};
const paymentConfig = {
    activeGateways: [
        {
            id: "STRIPE",
            name: "Credit / Debit Card (Stripe)",
            category: "card",
            countries: [
                "US",
                "GB",
                "EU",
                "CA",
                "AU",
                "GLOBAL"
            ],
            currencies: [
                "USD",
                "EUR",
                "GBP",
                "CAD",
                "AUD"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "PAYPAL",
            name: "PayPal Express",
            category: "wallet",
            countries: [
                "GLOBAL"
            ],
            currencies: [
                "USD",
                "EUR",
                "GBP"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "SSLCOMMERZ",
            name: "SSLCommerz (All Bangladesh Cards & MFS)",
            category: "card",
            countries: [
                "BD"
            ],
            currencies: [
                "BDT"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "BKASH",
            name: "bKash Direct Wallet",
            category: "wallet",
            countries: [
                "BD"
            ],
            currencies: [
                "BDT"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "RAZORPAY",
            name: "Razorpay (UPI, Cards & NetBanking)",
            category: "card",
            countries: [
                "IN"
            ],
            currencies: [
                "INR"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "PAYSTACK",
            name: "Paystack (African Gateway)",
            category: "card",
            countries: [
                "NG",
                "GH",
                "ZA",
                "KE"
            ],
            currencies: [
                "NGN",
                "GHS",
                "ZAR",
                "USD"
            ],
            isInstant: true,
            requiresTrxId: false
        },
        {
            id: "MANUAL_BANK",
            name: "Manual Bank / bKash Send Money / USDT Crypto",
            category: "bank",
            countries: [
                "GLOBAL",
                "BD",
                "AE"
            ],
            currencies: [
                "USD",
                "BDT",
                "EUR",
                "AED"
            ],
            isInstant: false,
            requiresTrxId: true,
            instructions: "Please transfer funds to one of the following accounts and input your Transaction Reference ID (TrxID) below for manual admin approval within 1-2 hours:\n\n" + "1. Bank Wire (USD): Chase Bank NYC, Acc: 9876543210, Routing: 021000021\n" + "2. Bangladesh bKash Merchant / Personal: +8801700000000\n" + "3. USDT (TRC-20): TXYZ1234567890abcdefghijklmnopqrst"
        }
    ],
    // Commission split calculation
    calculateSplit (totalAmount, commissionPercent = 15) {
        const platformFee = Math.round(totalAmount * (commissionPercent / 100) * 100) / 100;
        const providerEarnings = Math.round((totalAmount - platformFee) * 100) / 100;
        return {
            totalAmount,
            platformFee,
            providerEarnings,
            commissionPercent
        };
    }
};
}),
"[project]/packages/shared/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// packages/shared/index.ts
__turbopack_context__.s([]);
;
;
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06u77t7qvezvq._.js.map