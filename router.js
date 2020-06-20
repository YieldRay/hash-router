const $router = {
    init: function(){
        location.hash='/'
    },
    get: function (...after) {
        // normally pass nothing
        // return String
        let before = location.hash.slice(2).split('/')
        // use slice(2) to leave hash after [url]#/ 
        // for example, url 'http://localhost/index.html#/test/abc' will leave 'test/abc'
        // thus, make sure the first string after [url]# is '/'
        // we need initialize the page with location.hash='/'
        if (after == undefined) return before
        if (after.length === 1) after = after[0]
        if (typeof after === 'string') after = after.split('/')
        // things above, can make sure 'after' is an array
        if (!Array.isArray(after)) throw new Error('incoming parameters must be String or Array or Multiple Parameters')
        let i
        let newPath = '/'
        for (i = 0; i < after.length - 1; i++) {
            if(after[i] == undefined){
                if(before[i]==undefined) console.error(`past path[${i}] is missing, using undefined`,before,after)
                newPath+=before[i]+'/'
            }else{
                newPath+=after[i]+'/'
            }
        }

        if(after[i] == undefined){
            if(before[i]==undefined) console.error(`past path[${i}] is missing, using undefined`,before,after)
            newPath+=before[i]
        }else{
            newPath+=after[i]
        }// last path do not add '/'


        return newPath
    },
    set: function (...args) {
        if (args.length = 1) args = args[0]
        location.hash = this.get(args)
    }
};

Object.defineProperty($router,'path',{
    // pass and return String
    get(){return this.get()},
    set(str){this.set(str)}
})

window.$router=$router