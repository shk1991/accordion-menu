<template>
    <article id="a-accordion">
        <accordion-html :menu-list="list"></accordion-html>
    </article>
</template>

<style>
    #a-accordion{
        margin: 0 auto;
        border: 1px solid #ccc;
        width: 500px;
        margin:0 auto;
        padding: 20px 30px;
        line-height: 2;
    }
</style>
<script>
    import accordion from "accordion";
    import list from "@/js/commons/accordion-common.js";
    import accordionHtml from "@/js/commons/accordion-common.vue";
    export default {
        data(){
            return {
                list:list
            }
        },
        mounted(){
            accordion.init("a-accordion");
        },
        components:{
            accordionHtml
        }
    }
</script>