import {type I18n} from "./interface";

export const I18nZh: I18n = {
    lang: "zh",
    common: {
        activeTheme: "Active color scheme",
        authenticate: "Authenticate",
        cancel: "取消",
        changeTheme: "Change Theme - Active: {{ CURRENT }}",
        close: "关闭",
        copyToClip: "复制到剪贴板",
        delete: "删除",
        details: "详情",
        email: "电子邮箱",
        errTooShort: "输入过短",
        errTooLong: "输入过长",
        expandContent: "展开内容",
        hide: "隐藏",
        hours: "小时",
        invalidInput: "无效输入",
        legend: "标题",
        maxFileSize: "最大文件大小",
        minutes: "分",
        month: "月",
        months: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        never: "从不",
        password: "密码",
        refresh: "Refresh",
        required: "必填",
        save: "保存",
        search: "Search",
        seconds: "seconds",
        selectI18n: "选择语言",
        show: "显示",
        summary: "概要",
        weekDaysShort: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
        ],
        year: "年",
    },
    account: {
        account: "用户账户",
        accType: "账户类型",
        accTypePasskeyText1: "此账户目前为仅密钥登录账户。\n因此，此账户没有密码，也无需设置密码。",
        accTypePasskeyText2: "您可以转换此账户并添加密码。\n但请注意，调整后在新设备上登录时需额外进行密码验证。\n如果您没有事先输入过至少一次密码，您将无法在任何设备上登录。",
        accTypePasskeyText3: "您想要转换您的账户并添加一个密码吗？",
        accessExp: "过期",
        accessRenew: "续期至",
        accessRenewDelete: "禁止续期",
        birthdate: "生日",
        canModifyFor: "Passkeys can be modified for:",
        city: "城市",
        changePassword: "更改密码",
        convertAccount: "转换账户",
        convertAccountP1: "您可以将您的账户转换为仅密钥登陆账户。\n此转换将删除您的密码，您将仅能够通过注册的密钥进行登陆。\n请注意，只有支持额外用户验证的密钥可被用于登陆。\n如果您的密钥支持用户验证，您可以在“MFA”页面中，密钥名称的后面看到一个符号。",
        country: "国家",
        deviceId: "ID",
        deviceName: "名称",
        devices: "设备",
        devicesDesc: "链接到此账户的设备",
        emailUpdateConfirm: "电子邮件地址未被更新。我们已向您的新邮箱发送了一封消息。\n您需要点击其中的确认链接，电子邮件地址将在被确认后更新。",
        emailVerified: "已验证电子邮箱",
        familyName: "姓",
        federatedConvertPassword1: "您有一个联合账户。\n这意味着您是通过外部鉴权提供者登陆的。您当前的提供者是：",
        federatedConvertPassword2: "您可以通过电子邮件请求密码重置。这将向您的本地账户添加密码，\n之后您可以通过本地密码或您的外部提供者进行登陆。您想要请求密码重置吗？",
        generateRandom: "随机生成",
        givenName: "名",
        groups: "组",
        key: "密钥",
        keyUnique: "密钥必须唯一",
        lastLogin: "最后登录",
        mfaActivated: "多因子认证",
        navInfo: "信息",
        navEdit: "编辑",
        navMfa: "多因子认证",
        navLogout: "退出登录",
        other: "Other",
        pam: {
            generatePassword: "New Password",
            username: 'Username',
            validFor: "Password valid for {{ secs }} seconds",
        },
        passwordConfirm: "确认密码",
        passwordCurr: "当前密码",
        passwordCurrReq: "当前密码必填。",
        passwordNew: "新密码",
        passwordNewReq: "新密码必填",
        passwordNoMatch: "密码验证必填。",
        passwordExpiry: "密码过期",
        passwordPolicyFollow: "密码不符合要求。",
        passwordReset: "重置密码",
        phone: "手机",
        providerLink: "联合账户",
        providerLinkDesc: "您可以将此账户连接到下列登陆提供者之一。\n激活此功能后，您将被重定向至所选提供者的登陆页面。在成功登陆后，如果电子邮件匹配，您的账户将被连接。",
        providerUnlink: "取消联合",
        providerUnlinkDesc: "仅当您已设置至少一个密码或登陆密钥后，您才能和登陆提供者取消连接。",
        regDate: "注册日期",
        regIp: "注册IP地址",
        roles: "角色",
        street: "街道",
        user: "用户",
        userCreated: "创建于",
        userEnabled: "启用",
        userExpiry: "过期",
        userVerifiedTooltip: "指纹或PIN保护",
        webIdDesc: "您可以选择哪些字段能够通过WebID发布。\nWebID被一些网络用于去中心化登陆。如果您不知道这是什么，您通常不需要选择。",
        webIdDescData: "您可以以FOAF词汇格式向您的 WebID 添加自定义数据字段",
        webIdExpertMode: "启用专家模式",
        zip: "邮政编码"
    },
    authorize: {
        clientForceMfa: "本次登陆强制使用多因子认证以增强安全性。\n要完成登陆，请登入您的账户并添加一个登陆密钥。",
        clientGroupPrefixForbidden: "Missing group assignment for this login",
        email: "电子邮件地址",
        emailBadFormat: "错误的电子邮件地址格式",
        emailRequired: "电子邮件地址必填。",
        emailSentMsg: "如果您的电子邮件存在，我们已发送请求邮件。",
        expectingPasskey: "请使用MFA设备登陆",
        http429: "过多无效输入，已锁定至：",
        invalidCredentials: "无效证明",
        invalidKeyUsed: "无效密钥",
        login: "登陆",
        mfaAck: "已确认",
        orLoginWith: "或使用其他方式：",
        password: "密码",
        passwordForgotten: "忘记密码",
        passwordRequest: "请求",
        passwordRequired: "密码必填。",
        passwordResetDesc: `Please provide your E-Mail to request a password reset link. If your address exists in out
            database, you will receive a link via E-Mail.`,
        passwordResetSuccess: "Request received. You can close this window now.",
        requestExpires: "请求过期于",
        requestExpired: "请求已过期",
        signUp: "用户注册",
        validEmail: "验证电子邮件地址",
    },
    device: {
        accept: "接受",
        autoRedirectAccount: "您将被自动重定向至您的账户。",
        closeWindow: "您现在可以关闭此窗口了。",
        decline: "拒绝",
        desc: "请输入来自您的设备的{{count}}位用户代码。",
        descScopes: "此设备请求访问：",
        isAccepted: "请求已被接受。",
        isDeclined: "请求已被拒绝。",
        submit: "提交",
        title: "设备授权",
        userCode: "用户代码",
        wrongOrExpired: "代码错误或已过期"
    },
    emailChange: {
        title: "电子邮件地址已更新",
        textChanged: "您的电子邮件地址已从",
        textLogin: "您现在可以使用您的新地址进行登陆。",
        to: "更新为",
    },
    error: {
        // errorText: "找不到请求的资源",
        details: "显示详情",
        // detailsText: undefined,
    },
    index: {
        register: "注册",
        accountLogin: "登陆",
        adminLogin: "管理",
    },
    logout: {
        logout: "退出登录",
        confirmMsg: "您确定要退出登录并结束会话吗？",
        cancel: "取消",
    },
    mfa: {
        p1: "如果您计划在多个系统上使用您的MFA密钥，例如Windows和Android，您应该在Android上进行注册。",
        p2: "Android是支持无密码登陆特性最少的平台。能够在Android上进行注册的密钥也应能在其他平台上使用。",
        errorReg: "开始注册过程时出现错误。",
        lastUsed: "最后使用",
        noKey: "此槽位没有已注册的安全密钥",
        reAuthenticatePasskey: "Before you can modify Passkeys, you need to authenticate with an already registered one:",
        reAuthenticatePwd: "Before you can modify Passkeys, you need to re-authenticate with your password.",
        register: "注册",
        registerNew: "注册新的密钥",
        registerd: "注册时间",
        registerdKeys: "已注册的密钥",
        passkeyName: "密钥名称",
        passkeyNameErr: "需要名称需要有2-32个非特殊字符",
        passwordInvalid: "Password Invalid",
        test: "测试",
        testError: "开始测试时出现错误",
        testSuccess: "测试成功！"
    },
    pagination: {
        entries: "项目",
        gotoPage: "转到页面",
        gotoPagePrev: "转到前一页",
        gotoPageNext: "转到后一页",
        pagination: "分页",
        showCount: "显示数量",
        total: "总数",
    },
    passwordPolicy: {
        passwordPolicy: "密码要求",
        lengthMin: "最小长度",
        lengthMax: "最长长度",
        lowercaseMin: "最少小写字母",
        uppercaseMin: "最少大写字母",
        digitsMin: "最少数字",
        specialMin: "最少特殊字符",
        notRecent: "不是最近使用过的密码之一"
    },
    passwordReset: {
        accountLogin: "账户登录",
        badFormat: "格式错误",
        fidoLink: "https://fidoalliance.org/fido2/?lang=zh-hans",
        generate: "生成",
        newAccDesc1: "您可以在无密码账户和传统的密码账户之中选择其一。",
        newAccDesc2: "无密码账户应被优先考虑，因为其提供更强的安全性。\n您需要至少一个支持FIDO2标准的通行密钥（Yubikey、Apple Touch ID或Windows Hello等）以完成账户创建。\n获取更多信息：",
        newAccount: "新账户",
        passwordReset: "密码重置",
        password: "密码",
        passwordless: "通行密钥",
        passwordConfirm: "密码确认",
        passwordNoMatch: "密码不匹配",
        required: "必填",
        save: "保存",
        success1: "密码已成功更新。",
        success2: "您将被重定向。",
        success3: "如果您未被重定向，请点击此链接：",
        successPasskey1: "您的通行密钥已成功注册。",
        successPasskey2: "请登入您的账户并尽快注册一个备份密钥。\n对于仅密钥登陆的账户，在丢失您当前的密钥时，您无法通过电子邮件进行密码重置。"
    },
    register: {
        alreadyRegistered: "电子邮件地址已被注册",
        domainAllowed: "允许的域名：",
        domainErr: "此电子邮件域名不被允许",
        domainRestricted: "电子邮件域名被限制",
        email: "电子邮件",
        emailBadFormat: "错误的电子邮件地址格式",
        emailCheck: "请检查您的电子邮件收件箱",
        regexName: "名字应有2至32个非特殊字符。",
        register: "注册",
        success: "注册成功",
        userReg: "用户注册"
    },
    userRevoke: {
        title: "Revoke Logins",
        desc1: "All Logins and Sessions have been revoked for this user as much as possible.",
        desc2: "You should immediately renew all your passwords!",
    }
};