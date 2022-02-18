gitblog = {
	// 布置静态博客的网站,目前只支持github
	"api": "github",
	"github": {
		// 自定义域名必须填写username
		"username": "leenightmare",
		//用于获取用户的GitHub头像
		"userhead":"https://avatars.githubusercontent.com/{username}",
		// 一般不需要修改,用于自定义笔记位置
		"articles": "https://api.github.com/repos/{username}/{username}.github.io/contents/articles",
		// 一般不需要修改,用于自定义笔记位置
		"article": "https://{username}.github.io/articles/{article}",
		// 一般不需要修改,用于自定义背景位置,例如jsdelivr加速,第三方随机图片api等
		"background": "https://{username}.github.io/articles/assets/{article}/background.jpg",
		// OAuth Apps授权,申请地址 https://github.com/settings/developers 填写格式 clientID:clientSecret
		"clientID": "7387af928abb36c3b267",
		"clientSecret": "d27e312fdc70bd13a69b4aefd00914a88b554632"
	},
	// 返回一个字符串数组,包含除assets目录外,所有的articles子文件名和子文件夹名
	"getArticles": null,
	// 返回string类型的markdown内容
	"getArticle": null,
	// 返回background的路径
	"getBackground": null
}
