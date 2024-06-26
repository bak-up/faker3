/*
缓存IsvToken

如果你的网络环境不佳，你可以使用此脚本提前缓存，默认缓存到本地，缓存方式基于调用 getToken 模块脚本，更多功能详见如下Readme，支持配置代理和自定义缓存等
每次运行都会覆盖本地缓存请勿频繁运行，若非必要则不建议定时运行此脚本，否则请保持运行间隔在25分钟以上

7 7 7 7 * jd_cacheIsvToken.js

- ### 配置代理
  - #### 全局代理
    ```bash
    ## 启用代理
    export JD_ISV_GLOBAL_PROXY="true"
    ## 代理组件库相关控制变量
    # 定义 HTTP 代理地址（必填）
    export GLOBAL_AGENT_HTTP_PROXY="" # 例：http://127.0.0.1:8080
    # 过滤不需要代理的地址（必填）
    export GLOBAL_AGENT_NO_PROXY='127.0.0.1,172.17.0.1,*.telegram.org,oapi.dingtalk.com' # 用英文逗号分割多个地址，这里特别注意要把用到的内网ip过滤掉
    ```
    全局代理适用于本仓库绝大多数脚本，更多配置方法详见 [gajus/global-agent](https://github.com/gajus/global-agent)
    需要额外安装代理依赖库才能使用 `npm install -g global-agent`
    > 如果你正在使用 Arcadia 面板则无需重复安装此代理依赖库，并且可以通过命令选项 `--agent` 在任意脚本上便捷的实现全局代理功能，具体详见配置文件和文档
  - #### 获取 `Token` 局部代理
    ```bash
    export JD_ISV_TOKEN_PROXY="" # 代理接口地址
    ```
    目前受限于官方接口策略，同一IP段请求多个账号后会频繁响应 `403`，因此可能需要配合代理使用，使用代理时会自动重试请求至多3次  
    需要额外安装代理依赖库才能使用 `npm install -g hpagent`
    - ##### 通过 API 提取的动态代理
      如果你需要使用的是代理商接口所动态提供的代理地址，那么请定义下方的变量
      ```bash
      export JD_ISV_TOKEN_PROXY_API="" # 代理接口地址，例：http://example.com/api/getProxy?sevret=xxx
      export JD_ISV_TOKEN_PROXY_API_MAX="" # 每个代理地址的使用次数，默认为1次
      ```
      为了避免不必要的浪费建议将接口每次响应的代理地址数量设置为1个，另外建议将接口响应格式设置为单行文本的 `ip:port` 格式，同时也支持 `json` 格式不过仅适配了部分代理商  
      启用此模式后由环境变量 `JD_ISV_TOKEN_PROXY_API` 指定的固定代理地址将会自动被忽略，届时会使用接口响应数据所动态提供的代理地址
- ### 自定义 `Token` 缓存
  - #### 自定义缓存文件路径
    ```bash
    export JD_ISV_TOKEN_CUSTOM_CACHE="" # 绝对路径，建议以 token.json 命名
    ```
    > 此文件默认存储在仓库 `function/cache` 目录下
  - #### 使用 `Redis` 数据库
    ```bash
    export JD_ISV_TOKEN_REDIS_CACHE_URL="" # 数据库地址，例：redis://password@127.0.0.1:6379/0
    export JD_ISV_TOKEN_REDIS_CACHE_KEY="" # 自定义提取或提交的键名规则，详见下方说明
    export JD_ISV_TOKEN_REDIS_CACHE_SUBMIT="" # 是否向数据库提交新的缓存token（true/false），默认是
    ```
    > 需要额外安装依赖库才能使用 `npm install -g redis`，默认从键名为用户名的字符串对象中提取键值，用户名是解码后的  
    > 如果你想自定义键名格式则需要将用户名位置设为 `<pt_pin>` 例如：`isv_token:<pt_pin>`，否则将自动在末尾追加

*/

const $ = new Env('缓存IsvToken')
const jdCookie = require('./jdCookie')
const common = require('./function/jdCommon')
const notify = require('./function/sendJDNotify')
const getToken = require('./function/getToken')

var version_='jsjiami.com.v7';function llIiI1iI(_0x3f1577,_0x11d530){const _0x2a3079=iiI1Ii1I();return llIiI1iI=function(_0x3b69f0,_0x11d281){_0x3b69f0=_0x3b69f0-0x7c;let _0x148a20=_0x2a3079[_0x3b69f0];if(llIiI1iI['WPgqgq']===undefined){var _0x5ebcb1=function(_0x1bd297){const _0x523181='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x2c7d63='',_0x2537a6='';for(let _0x1dd946=0x0,_0x30958e,_0x587529,_0x5a7dc4=0x0;_0x587529=_0x1bd297['charAt'](_0x5a7dc4++);~_0x587529&&(_0x30958e=_0x1dd946%0x4?_0x30958e*0x40+_0x587529:_0x587529,_0x1dd946++%0x4)?_0x2c7d63+=String['fromCharCode'](0xff&_0x30958e>>(-0x2*_0x1dd946&0x6)):0x0){_0x587529=_0x523181['indexOf'](_0x587529);}for(let _0x1f2974=0x0,_0x378e28=_0x2c7d63['length'];_0x1f2974<_0x378e28;_0x1f2974++){_0x2537a6+='%'+('00'+_0x2c7d63['charCodeAt'](_0x1f2974)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2537a6);};const _0x20e616=function(_0xe00ffb,_0x564cf5){let _0x3aa79a=[],_0x269f78=0x0,_0x4cf528,_0x37367f='';_0xe00ffb=_0x5ebcb1(_0xe00ffb);let _0x2d47bc;for(_0x2d47bc=0x0;_0x2d47bc<0x100;_0x2d47bc++){_0x3aa79a[_0x2d47bc]=_0x2d47bc;}for(_0x2d47bc=0x0;_0x2d47bc<0x100;_0x2d47bc++){_0x269f78=(_0x269f78+_0x3aa79a[_0x2d47bc]+_0x564cf5['charCodeAt'](_0x2d47bc%_0x564cf5['length']))%0x100,_0x4cf528=_0x3aa79a[_0x2d47bc],_0x3aa79a[_0x2d47bc]=_0x3aa79a[_0x269f78],_0x3aa79a[_0x269f78]=_0x4cf528;}_0x2d47bc=0x0,_0x269f78=0x0;for(let _0xf0882e=0x0;_0xf0882e<_0xe00ffb['length'];_0xf0882e++){_0x2d47bc=(_0x2d47bc+0x1)%0x100,_0x269f78=(_0x269f78+_0x3aa79a[_0x2d47bc])%0x100,_0x4cf528=_0x3aa79a[_0x2d47bc],_0x3aa79a[_0x2d47bc]=_0x3aa79a[_0x269f78],_0x3aa79a[_0x269f78]=_0x4cf528,_0x37367f+=String['fromCharCode'](_0xe00ffb['charCodeAt'](_0xf0882e)^_0x3aa79a[(_0x3aa79a[_0x2d47bc]+_0x3aa79a[_0x269f78])%0x100]);}return _0x37367f;};llIiI1iI['pbAQVI']=_0x20e616,_0x3f1577=arguments,llIiI1iI['WPgqgq']=!![];}const _0x5ead9d=_0x2a3079[0x0],_0x2b93c7=_0x3b69f0+_0x5ead9d,_0x1186c7=_0x3f1577[_0x2b93c7];return!_0x1186c7?(llIiI1iI['dyVyCs']===undefined&&(llIiI1iI['dyVyCs']=!![]),_0x148a20=llIiI1iI['pbAQVI'](_0x148a20,_0x11d281),_0x3f1577[_0x2b93c7]=_0x148a20):_0x148a20=_0x1186c7,_0x148a20;},llIiI1iI(_0x3f1577,_0x11d530);}const III1i11I=llIiI1iI;(function(Il11i1I,Illli1Il,iI1iiII1,IiII1i1,iili1i11,lIilIll1,i1iiIl11){return Il11i1I=Il11i1I>>0x1,lIilIll1='hs',i1iiIl11='hs',function(lIIiii11,II11i1ii,IllIll,li1iiIil,ilII1il){const I111Il1=llIiI1iI;li1iiIil='tfi',lIilIll1=li1iiIil+lIilIll1,ilII1il='up',i1iiIl11+=ilII1il,lIilIll1=IllIll(lIilIll1),i1iiIl11=IllIll(i1iiIl11),IllIll=0x0;const II11lil=lIIiii11();while(!![]&&--IiII1i1+II11i1ii){try{li1iiIil=parseInt(I111Il1(0xce,'1w]^'))/0x1+-parseInt(I111Il1(0x7f,'uCta'))/0x2+parseInt(I111Il1(0xf7,'p6Xn'))/0x3+-parseInt(I111Il1(0xe9,'12BW'))/0x4+parseInt(I111Il1(0xb4,'1ud1'))/0x5+-parseInt(I111Il1(0xf0,'2ptK'))/0x6+-parseInt(I111Il1(0x94,'1w]^'))/0x7*(-parseInt(I111Il1(0x104,'C%P^'))/0x8);}catch(lll1lii1){li1iiIil=IllIll;}finally{ilII1il=II11lil[lIilIll1]();if(Il11i1I<=IiII1i1)IllIll?iili1i11?li1iiIil=ilII1il:iili1i11=ilII1il:IllIll=ilII1il;else{if(IllIll==iili1i11['replace'](/[pDEGlkSUHuKWVqCOdfry=]/g,'')){if(li1iiIil===II11i1ii){II11lil['un'+lIilIll1](ilII1il);break;}II11lil[i1iiIl11](ilII1il);}}}}}(iI1iiII1,Illli1Il,function(lill1lIi,lli1lll,i1ll1ilI,I1Ili111,I11ll1l,l11lI,iI1l1II){return lli1lll='\x73\x70\x6c\x69\x74',lill1lIi=arguments[0x0],lill1lIi=lill1lIi[lli1lll](''),i1ll1ilI=`\x72\x65\x76\x65\x72\x73\x65`,lill1lIi=lill1lIi[i1ll1ilI]('\x76'),I1Ili111=`\x6a\x6f\x69\x6e`,(0x146f7a,lill1lIi[I1Ili111](''));});}(0x198,0x800b6,iiI1Ii1I,0xce),iiI1Ii1I)&&(version_=III1i11I(0xb7,'yeB&'));let cookie='',originCookie='';const cookiesArr=Object[III1i11I(0x98,'mzz3')](jdCookie)[III1i11I(0xd5,'QWAc')](il11Ii1l=>jdCookie[il11Ii1l])[III1i11I(0xbf,'MKYC')](IIlll1i=>IIlll1i);function iiI1Ii1I(){const lIlI1lll=(function(){return[...[version_,'KSjWlsujrViamqidUy.VckpoWmfr.DGCvHl7OuED==','W6JcICorq8oJW4uW5BYL5AAQ44ke5lIe5lMZ6lwn5y2w','eSkkW4SeW4m','W7ddGfa','W714WRq','ybHQC2GdCMpcGSkQ','W65Da8oBW68OoW','WPWotHbPW7hdQuFdQSkBW6z2','WPPlD104wclcUqK','W4ZdHvSJxZZcIujCWRZcPW','W7TnFa','mYjcAmk6k8k7W40RFgC','CmouWOGkWPOOW4i','572Y5A+q5A2s5QYG','qZjPzYK','d8oPWRpcKa','pCogn3y2','Arr9vumrBgC','c8oPWPZcVMS','fSoWqGxcIGpcSq','pHlcS0tdMGRdSN3cJZ7dVZKD','WOhcTSk8eIG','4P2AWRdOHBxMNPFOV4JOOkdPGQ/LIOJKUilPLBxORQBdKq','wmolnCogWONcNmkaxgaRWQzlxty','WOWKWRldJKr3','qcxdQGqL','kHhdOCoIbq','W51Cf3mo','WQZdHXO','WRBcUa3dUSoh','WQtdHXaZW7W','j8oAWRaMW4q1','Ex/dT1TH','4PYOW6BNVRFLRylLPkFOTjy','ebNdTSotcW','W4tdG1eeaq','WQb8g8k5WPldNMVdUSoWeva4W4BcRCoqnmoGWPLNW6itWR1itxWIWQyhw8oRW73cI8kNW6W','W6xdKmosuMK','W4pdK2ikAW','m8odW5rN','WPdcOComomomWQ/cRmocW6NcKCkmWQdcVCoSWR1nrIFdJCo5cCoCnwZcN00','rSowWR0dWO4','auFdUWHg','efVcQYDZWPi','AZPl','khldTZ1EuG'],...(function(){return[...['CYpcQg8CdHZcRmk8WOzNWR0','ghNcR8o9W4q','jCowW5TfBW','a8oWrIRcHa/cV8oUBmo+qSkzoSoY','c2VcRIbp','572n5A6c5A6B5Q+m','44gt5O+R56sp44oJ6kYC5yAM6i6P5yYLWQ7dHCoSWQfRaq','B8oqWOG','W4RdUCoWtN8','aeBcNSonW60','WO7dJmkC','W7NcL1TnWQ4AW57dJvD0EG','WPRcOCkRiHuvtCkB','Cx9WpCkZW7O','W6RINljc','a8olWRRcR1G','jXddQ8oI','o8oieG','W4tdL0iVAYpcJcbwWQdcVSo6qqy','jGFdRmoZ','WORdL8kpgCk6W5u1cGldVSoafKBdImoLvmo+kSo9W7ucWQ9JW64kkvlcO3r/','W6jGWRKwxa','W6RdL8oyvN3dQ8kj','W4zBcLe/WQhdMq','uJtdLam1','nCooWOBcPwC','ymo8bSo3Eq','W7FdOmo5zMXgtSkhWQbLj8kA','AuNdVG','W7tdM0mFpCoCDt7cSCk0DcLzWRBcJaxcIGZcP8kxFSopWRmIe8o4W5pdOCkmrq','fSooWQ3dVLC','WPDQz8ocWRK','dCorWRldKxKlp8oKnJBcKqW','qK7dGhTqAmo8','wKvkW5RdNCo9WR1wy3dcVu1U','jCohWPVdJNe','amkcWO/dS8kA','WPlcTmo6a8oh','WQWLW71wbSkZqspdHglcHwq','kSknW6nyBW','gWq2WOZcRG','rIFdVmkQWOVdVcHiWQpdUqZcOG','kZ9w','W6zMDXio','WRLfuCoWWOi','W7lXIOgBAoI9R+IJMEE5KoADSCkp','WPxcSmolo8oEW7ldPG'],...(function(){return['W7tdLmoqyea','WQrYWQPSWPewWOO','W77dJKqkg8kunL3cRmk/EG','44o55O++56s544cp6k6G5yw/6i++5yYgl0uGWO/dSSoe','4P+0mEIeIUAEHEI8QEIGN+MdSEwlQos4IUMvQEIUQfu','W6tdSSo9W43cUq','lmkiCwOY','W41GW5tcIeHaW70+xW4','WRJcLa4','WP5zhCkOWQy','FN4go8o5wSk6W5SYuLpdQG','rokDMSke','CmoVW6pcRSoYWP4KW4D/W7i0WQK','W5VdQvKGbq','WRZcRWpdImoP','WQ3cPSoDoSoXW7tdRSki','mCk1W4fOwflcJ8kE','zmoyWOa','WQvThmk6WOdcGYe','WR97WRbtWPe','zIpdLa','WOFcMLb1W5Oq','Ec3dNrmWFq','aaakWQNcImkLW64','WOnMeG','WQepqmkf','e3BcUmo9W6NcUrfZWRldVt8','h37cQmoZW7lcQHbA','vCkNb1/dNLhdPmovw8oawCkTaq','WQXNDCokWP4','lc1ZrSk2','zhX3f8k7','WPBWTkout+I+NUIIQUE6IEAEJCop','DY7cOgSEyGlcU8kVWP5M','cSo0xWW','CsFcRw8ta2/cJSkVWRXCWRNdQW','a8kizSkzWO3cQmkUp3eM','cuVcVbe','cCotWRFdPeK','l15BWPxcN8kg','cCoMvq','jSkUDv4D','vSkuW6pcId9A','WP/cMHNdJmoU','nCowW41YzCkafSogW4BdU13dUt9tFMZcKuTxj8o4WQrvW5qlWO7cJ8ksWOLi','q0tdLa'];}())];}())];}());iiI1Ii1I=function(){return lIlI1lll;};return iiI1Ii1I();};!cookiesArr[0x0]&&($[III1i11I(0x9b,'yiIE')]($[III1i11I(0xc7,'Y0l@')],III1i11I(0xd4,'WDdz')),process[III1i11I(0x8c,'#@dx')](0x1));!(async()=>{const lilIIii1=III1i11I,i1i11lll={'VTDSP':lilIIii1(0x100,'KCca'),'XlfkO':lilIIii1(0xd3,'^wlz'),'qDlAG':lilIIii1(0xe2,'IvMm'),'qPhtB':lilIIii1(0xc8,'IP0H'),'GFnOK':lilIIii1(0x9f,'Y0l@'),'nirOf':lilIIii1(0xc4,'PQqc'),'rRfsV':lilIIii1(0xeb,'@Ynj'),'FGFyn':function(iilIiIli,iIlIil1i){return iilIiIli<iIlIil1i;},'Xxgtj':function(IliIiI1I,iI11ii1l){return IliIiI1I===iI11ii1l;},'bCdZK':lilIIii1(0xd7,'p6Xn'),'hTjhe':function(liI11Ill,l1iI1Ii1){return liI11Ill+l1iI1Ii1;},'Kaplb':function(Iii1Iil1,llIililI){return Iii1Iil1(llIililI);},'HZXeZ':lilIIii1(0xb8,'C%P^'),'xjfWQ':function(l11I1li){return l11I1li();},'iEkBR':function(iIl111I1,IIilllil){return iIl111I1===IIilllil;},'xtbGy':lilIIii1(0xc2,'gsCq'),'NKGBy':lilIIii1(0x7e,'A1Yq')};$[lilIIii1(0xff,'@Ynj')]=[i1i11lll[lilIIii1(0xf9,'nK^$')],i1i11lll[lilIIii1(0x7c,'Z*ty')],i1i11lll[lilIIii1(0x80,'@Ynj')],i1i11lll[lilIIii1(0xbe,'MGSP')],i1i11lll[lilIIii1(0x103,'^wlz')]],notify[lilIIii1(0xdb,'OoT)')]({'title':$[lilIIii1(0xaf,'W&Yr')]});for(let ill1Il1I=0x0;i1i11lll[lilIIii1(0xd6,']C*H')](ill1Il1I,cookiesArr[lilIIii1(0xcd,'1w]^')]);ill1Il1I++){if(i1i11lll[lilIIii1(0xe6,'bor8')](i1i11lll[lilIIii1(0xbd,'ljEg')],i1i11lll[lilIIii1(0xdd,'W&Yr')])){$[lilIIii1(0xba,'gsCq')]=i1i11lll[lilIIii1(0x81,'ljEg')](ill1Il1I,0x1),cookie=cookiesArr[ill1Il1I],originCookie=cookiesArr[ill1Il1I],common[lilIIii1(0xa8,'KCca')](originCookie),$[lilIIii1(0x82,'IP0H')]=i1i11lll[lilIIii1(0x9e,'ljEg')](decodeURIComponent,common[lilIIii1(0xd1,'yiIE')](cookie,i1i11lll[lilIIii1(0xf2,'uCta')])),$[lilIIii1(0xe5,'b#CW')]=notify[lilIIii1(0x9d,'pSd[')]($[lilIIii1(0xc5,']C*H')],$[lilIIii1(0xda,'12BW')]),$[lilIIii1(0x8e,'p6Xn')]='',console[lilIIii1(0x105,'ljEg')](lilIIii1(0xa1,'IvMm')+$[lilIIii1(0xcf,'p6Xn')]+'】'+($[lilIIii1(0xb1,'cVyP')]||$[lilIIii1(0x83,'A1Yq')])+lilIIii1(0xa6,'#@dx')),await i1i11lll[lilIIii1(0xfd,']C*H')](Main),common[lilIIii1(0xab,'0Vax')]();if($[lilIIii1(0x8a,'2ptK')]||$[lilIIii1(0xcb,'mzz3')])break;}else I1l1i1I1[lilIIii1(0xf8,'0Vax')](iii1illI[lilIIii1(0x95,'yiIE')],i1i11lll[lilIIii1(0xc0,'FF3O')]),i1i1l1ii[lilIIii1(0xe1,'gsCq')](0x1);}const iilliIII=notify[lilIIii1(0xa5,'cVyP')]();iilliIII&&(i1i11lll[lilIIii1(0xd2,'mzz3')](i1i11lll[lilIIii1(0x9c,'^wlz')],i1i11lll[lilIIii1(0xd0,'Y0l@')])?console[lilIIii1(0xcc,'GuCu')](lilIIii1(0x93,'@Ynj')+iilliIII[lilIIii1(0xb3,'yiIE')](/：/g,i1i11lll[lilIIii1(0xf5,'A1Yq')])):(l1iiilI1[lilIIii1(0xa0,'FF3O')](i1i11lll[lilIIii1(0xc3,'@Ynj')]),Iill1l1[lilIIii1(0x85,'PQqc')][lilIIii1(0x84,'QWAc')](i1i11lll[lilIIii1(0xed,'NHK8')])));})()[III1i11I(0x90,'NHK8')](IIi1Iii=>$[III1i11I(0x88,'Amy(')](IIi1Iii))[III1i11I(0xe4,']C*H')](()=>$[III1i11I(0xde,'gsCq')]());async function Main(){const I1lI1II=III1i11I,lIliIIii={'jaBKx':I1lI1II(0xc1,'A1Yq'),'mwJLa':I1lI1II(0xdc,'MGSP'),'vbnQP':function(Il1III11,ll1lliii){return Il1III11*ll1lliii;},'JiYsz':function(illill1,iIlIll,IlIiIIil,I111III1){return illill1(iIlIll,IlIiIIil,I111III1);},'vliLa':function(lIilI1il,l1lIiil){return lIilI1il===l1lIiil;},'dXTnD':I1lI1II(0xb5,'12BW'),'TFXPt':I1lI1II(0xca,'1w]^'),'yquul':I1lI1II(0xad,'W&Yr'),'DgEeu':I1lI1II(0xf6,'2ptK'),'vCPYt':I1lI1II(0xf1,'&1CQ')};try{const ilili1iI=$[I1lI1II(0xa9,'2s]y')][Math[I1lI1II(0x99,'&1CQ')](lIliIIii[I1lI1II(0xbb,'b#CW')](Math[I1lI1II(0x89,'bor8')](),$[I1lI1II(0x8d,'p6Xn')][I1lI1II(0x9a,'WDdz')]))],lI1Il1li=await lIliIIii[I1lI1II(0xb9,'bor8')](getToken,originCookie,ilili1iI,![]);lI1Il1li?lIliIIii[I1lI1II(0x86,'qlCI')](lIliIIii[I1lI1II(0xa2,'YKc(')],lIliIIii[I1lI1II(0xe7,'W&Yr')])?(lll1lIli[I1lI1II(0xdf,'tn5K')](lIliIIii[I1lI1II(0xb0,'tn5K')]),lllllIii[I1lI1II(0xfc,'IP0H')][I1lI1II(0xea,'1ud1')](lIliIIii[I1lI1II(0xb2,'W&Yr')])):(console[I1lI1II(0xd8,'IvMm')](lIliIIii[I1lI1II(0xec,'&1CQ')]),$[I1lI1II(0xef,'FF3O')][I1lI1II(0xa4,'&&Vj')](lIliIIii[I1lI1II(0xe3,'&&Vj')])):lIliIIii[I1lI1II(0x92,'OoT)')](lIliIIii[I1lI1II(0xc9,'QWAc')],lIliIIii[I1lI1II(0xae,'GuCu')])?(console[I1lI1II(0x87,'bor8')](lIliIIii[I1lI1II(0x91,'0Vax')]),$[I1lI1II(0xfe,'qlCI')][I1lI1II(0xbc,'MGSP')](lIliIIii[I1lI1II(0xf3,'IP0H')])):iI111liI[I1lI1II(0xa3,'@Ynj')](I1lI1II(0xb6,'(*j9')+l1li11I);}catch(l1Illll){lIliIIii[I1lI1II(0xe8,'(*j9')](lIliIIii[I1lI1II(0xfa,'NHK8')],lIliIIii[I1lI1II(0x102,'wPBG')])?console[I1lI1II(0xaa,'nK^$')](I1lI1II(0x101,'9uD5')+l1Illll):lli1i11I[I1lI1II(0x8b,'Z*ty')](I1lI1II(0xfb,'IP0H')+li1lIii[I1lI1II(0xac,'QWAc')](/：/g,lIliIIii[I1lI1II(0xc6,'2s]y')]));}}var version_ = 'jsjiami.com.v7';

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
