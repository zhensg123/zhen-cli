
exports.IS_TEST = process.env.NODE_ENV === 'test' // 测试环境
exports.IS_PRODUCTION = process.env.NODE_ENV !== 'development' // 非开发环境
exports.USE_CDN = false
