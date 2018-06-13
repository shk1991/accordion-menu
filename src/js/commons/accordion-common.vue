<template>
	<div class="accordion-list">
		<template v-for="item in menuList">	
	        <!-- 有二级菜单 -->
	        <template v-if="item.childNodes && item.childNodes.length">
	            <div class="a-title" :id="item.id">
	                <i class="fa fa-plus-square-o"></i>
	                {{item.name}}
				    <span 
				    	@click.stop="setRole(item)" 
				    	:class="getLenth(item)"
				    	v-html="checkbox"
		    		>
				    </span>				    
	            </div>
	            <div class="a-content">
	            	<accordion-html :menu-list="item.childNodes"></accordion-html>
	            </div>
	        </template>
	        <!-- 无二级菜单 -->
	        <template v-else>
	            <div class="a-title">
	            	{{item.name}}
				    <span 
				    	@click.stop="setRole(item)" 
				    	:class="{'checked':item.check}"
				    	v-html="checkbox"
			    	>
				    </span>	
	        	</div>
	        </template>
        </template>
	</div>
</template>

<script>
	import "./accordion-common.scss";
	export default{
		name:"accordionHtml",
		props:["menuList"],
		data(){
			return {
				checkbox:'<i class="fa fa-square-o"></i>'
			}
		},
		methods:{
			checkQuery(arr){	//勾选其他选项时，选中查询
				for(let key of arr){
					// if(key.name == "查询" && key.type == "func"){
					// 	key.check = true;
					// 	return false;
					// }
					if(key.name == "查询"){
						key.check = true;
						return false;
					}
				}
			},
			setRole(obj){	//切换选中状态
				let item = obj.childNodes;
				obj.check = !obj.check;	
				item && item.length && this.eachRole(item,obj.check);
			},
			eachRole(arr,b){	//更新当前点击所有子菜单选中状态
				for(let key of arr){
					if(key.childNodes && key.childNodes.length){
						this.eachRole(key.childNodes,b);
					}
					key.check = b;
				}
			},			
			getLenth(obj){	//判断父菜单选中状态
				var arr = obj.childNodes, check, hCheck;
				check = this.getIsNoRole(arr);
				obj.check = hCheck = check.a > 0;
				// if(hCheck){
				// 	this.checkQuery(arr);
				// }
				return (check.a == check.b && "checked") || (hCheck > 0 && "section") || "";
			},
			getIsNoRole(arr,a,b){	//子菜单是否全部选中
				var a = a || 0;
				var b = b || 0;
				for(let key of arr){
					b ++;
					if(key.check){
						a ++;
					}
					if(key.childNodes && key.childNodes.length){
						let t = this.getIsNoRole(key.childNodes);
						a += t.a;
						b += t.b;
					}
				}
				return {a:a,b:b}
			}
		}
	}
</script>