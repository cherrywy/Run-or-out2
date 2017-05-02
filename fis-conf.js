fis.hook('commonjs');

fis.match('*.{js,scss,css,png,jpg,eot,svg,ttf,woff}', {
	useHash: true,
	release: '/public/$0'
});
fis.match('*.json', {
  release: '/public/$0'
});

fis.match('*.{eot,svg,ttf,woff}', {
	release: '/public/$0'
});

// 发布生产版本 html => php
// fis.match('/views/**', {
//     rExt: '.php'
// });

// sass解析
fis.match('*.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('node-sass'),
    optimizer: fis.plugin('clean-css')
});

// 压缩js
fis.match('/static/**.js', {
	optimizer: fis.plugin('uglify-js')
});

fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

fis.match('/static/modules/*.js', {
    isMod: true, // 设置 comp 下都是一些组件，组件建议都是匿名方式 define
    release: '/public/$0'
});

fis.media('debug').match('*.{js,scss,png}', {
	useHash: false,
	useSprite: false,
	optimizer: null
});

// 发布命令 fis3 release test
// 输出为php
fis.media('test').match('/views/**', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://hm.runorout.com/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_DZ'
  })
}).match('*.html', {
	rExt: '.php',
	release: '/resources/$0'
});
// 输出静态资源
fis.media('test').match('{/static/**.{js,scss,css,json,eot,svg,ttf,woff},/lib/**}', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://hm.runorout.com/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_DZ/public'
  })
});
// 输出图片
fis.media('pushtestimg').match('/static/**.{jpg,png,jpeg}', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://hm.runorout.com/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_DZ/public'
  })
});

// 发布命令 fis3 release online
// 输出为php
fis.media('online').match('/views/**', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://www.runorout.cn/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_WAR'
  })
}).match('*.html', {
    rExt: '.php',
    release: '/resources/$0'
});
// 输出静态资源
fis.media('online').match('{/static/**.{js,scss,css,json,eot,svg,ttf,woff},/lib/**}', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://www.runorout.cn/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_WAR/public'
  })
});
// 输出图片
fis.media('onlineimg').match('/static/**.{jpg,png,jpeg}', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://www.runorout.cn/_build/receiver.php',
    //远端目录
    to: '/var/www/RO_WAR/public'
  })
});

// 更新二维码 fis3 release pushquncode
fis.media('pushquncode').match('/views/emergency.html', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://www.runorout.cn/_build/receiver.php',
    to: '/var/www/RO_WAR'
  })
}).match('*.html', {
    rExt: '.php',
    release: '/resources/$0'
});
fis.media('pushquncode').match('{/static/**qun-code.jpg,/lib/**}', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://www.runorout.cn/_build/receiver.php',
    to: '/var/www/RO_WAR/public'
  })
});