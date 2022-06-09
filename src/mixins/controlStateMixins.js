const controlStateMixins = {
    data() {
        return {

            mixinCSIcon:null,
            mixinCSIconColor:null,
            mixinCSText:null,
            mixinCSGif:null,

            
            mixinBtnDeliveryState:null,
            mixinBtnDeliveryStateColor:null,
            mixinBtnDeliveryText:null,
            mixinBtnDeliveryTextColor:null,
            
            mixinBtnAndamentoState:null,
            mixinBtnAndamentoStateColor:null,
            mixinBtnAndamentoTextColor:null,

            mixinBtnGiveupState:null,
            mixinBtnGiveupStateColor:null,
            mixinBtnGiveupTextColor:null,
            

        }
    },

    methods: {

        setState: function (icon,color,text,gif){
            this.mixinCSIcon = icon
            this.mixinCSIconColor = color
            this.mixinCSText = text
            this.mixinCSGif = gif
        },


        setMixinState: function (targetState,state,icon,color,text,gif){
            if (targetState == state) this.setState(icon,color,text,gif)
            return null
        },

        setMixinState2: function (targetState1,state1,targetState2,state2,icon,color,text,gif){
            if (targetState1 == state1 && targetState2 == state2){
                this.setState(icon,color,text,gif)  
            } 
            return null
        },

        setMixinState3: function (targetState1,state1,targetState2,state2,icon,color,text,gif){
            if (state1.includes(targetState1) && state2.includes(targetState2)){
               this.setState(icon,color,text,gif)
            }
        },


        dialogState: function (obj,prop,state,values,action){
            let resp = eval(obj)
            if (values.includes(state))
               resp[prop] = action
        },

        dialogStateDisable: function (obj,prop,state,values,func){
            let resp = eval(obj)
            if (values.includes(state))
               func()
        },

       


        setStateCallback1: function(state,value,func){
            if (state == value)
               func()
        },


        setStateCallback2: function(state1,state2,value1,value2,func){
            if (state1 || state2){
                if (state1 == value1 || state2 == value2)
                    func()
            }
            if (state1 && state2){
                if (state1 == value1 && state2 == value2)
                    func()
            }
        },


        setStateCallback3: function(state,values,func){
            if (values.includes(state))
               func()
        },

        setStateCallback4: function(state,value,func){
            if (state !== value)
               func()
        },

        setStateCallback5: function(expression,func){
            let a = eval(expression)
            if (a)
                func()
        }
    }
}
export default controlStateMixins
