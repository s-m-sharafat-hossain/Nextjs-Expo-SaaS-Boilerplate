(()=>{"use strict";module.exports = [
"[project]/apps/web/src/app/(auth)/signup/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$layouts$2f$CenteredAuthLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/config/master.config.ts [app-ssr] (ecmascript)");
// apps/web/src/app/(auth)/signup/page.tsx
"use client";
;
;
;
;
;
;
;
function SignupPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("CONSUMER");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        try {
            if (role === "PROVIDER") {
                router.push("/provider");
            } else {
                router.push("/consumer");
            }
        } catch  {
            setErrorMsg("Failed to create account. Please try again.");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$layouts$2f$CenteredAuthLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CenteredAuthLayout"], {
        title: "Create Your Account",
        subtitle: "Get started with complimentary bonus credits and explore all platform features.",
        children: [
            errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: errorMsg
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
                                children: "I am registering as:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setRole("CONSUMER"),
                                        className: `p-2.5 rounded-xl border text-xs font-semibold transition-all ${role === "CONSUMER" ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`,
                                        children: [
                                            "👤 ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].roleLabels.consumer.singular
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setRole("PROVIDER"),
                                        className: `p-2.5 rounded-xl border text-xs font-semibold transition-all ${role === "PROVIDER" ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`,
                                        children: [
                                            "🩺 ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].roleLabels.provider.singular
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
                                children: "Full Name"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                placeholder: "Alex Morgan",
                                required: true,
                                className: "w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
                                children: "Email Address"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                placeholder: "alex@example.com",
                                required: true,
                                className: "w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
                                children: "Password (min. 8 characters)"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                placeholder: "••••••••••••",
                                required: true,
                                minLength: 8,
                                className: "w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isLoading,
                        className: "w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 flex items-center justify-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isLoading ? "Creating account..." : "Start Free Trial"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-xs text-slate-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Already have an account? "
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
                        children: "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(auth)/signup/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CenteredAuthLayout",
    ()=>CenteredAuthLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.mjs [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/config/master.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$design$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/design/theme-provider.tsx [app-ssr] (ecmascript)");
// apps/web/src/shared/layouts/CenteredAuthLayout.tsx
"use client";
;
;
;
;
;
function CenteredAuthLayout({ children, title, subtitle }) {
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$design$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden antialiased",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 left-6 right-6 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Back to Homepage"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTheme(theme === "dark" ? "light" : "dark"),
                        className: "p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors",
                        title: "Toggle Theme",
                        children: theme === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                            lineNumber: 40,
                            columnNumber: 31
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                            lineNumber: 40,
                            columnNumber: 51
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sm:mx-auto sm:w-full sm:max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2.5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 sm:mx-auto sm:w-full sm:max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-[#111827] py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl",
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 pt-6 border-t border-slate-100 dark:border-slate-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-slate-500 flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 13,
                                                className: "text-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this),
                                            "1-Click Portfolio Demo Login"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin",
                                            className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-medium text-rose-800 dark:text-rose-300 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2 font-semibold",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            size: 14,
                                                            className: "text-rose-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                            lineNumber: 84,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Super Admin Portal"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-rose-500",
                                                    children: "Instant Demo →"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/provider",
                                            className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2 font-semibold",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                                            size: 14,
                                                            className: "text-emerald-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 19
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].roleLabels.provider.singular,
                                                        " (Provider) Portal"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-emerald-500",
                                                    children: "Instant Demo →"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/consumer",
                                            className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs font-medium text-blue-800 dark:text-blue-300 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2 font-semibold",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            size: 14,
                                                            className: "text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                            lineNumber: 106,
                                                            columnNumber: 19
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$config$2f$master$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].roleLabels.consumer.singular,
                                                        " (Consumer) Portal"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-blue-500",
                                                    children: "Instant Demo →"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                            lineNumber: 101,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/shared/layouts/CenteredAuthLayout.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/shared/config/master.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/packages/shared/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// packages/shared/index.ts
__turbopack_context__.s([]);
;
;
}),
];})()

//# sourceMappingURL=_1g43t5_q2r56h._.js.map