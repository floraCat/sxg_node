<template>
<footer class="footnav">
    <li v-for="col in cols" :class="[col.name,{on: col.on}]" v-bind:key="col.id">
        <a :href="col.href">
            <span class="icon"><img :src="col.icon" /></span>
            <span class="iconOn"><img :src="col.iconOn" /></span>
            <p v-text="col.ttl"></p>
        </a>
        <em v-if="col.name === 'cart' && cart_nums" class="num" @click="test(col.name)" v-text="cart_nums"></em>
    </li>
</footer>
</template>

<script>
export default {
    data () {
        return {
            cols: [
                {
                    id: 1,
                    name: 'index',
                    ttl: '首页',
                    on: true,
                    href: '#',
                    icon: 'http://localhost:8888/imgs/circle.png',
                    iconOn: 'http://localhost:8888/imgs/circle_on.png'
                },
                {
                    id: 2,
                    name: 'cat',
                    ttl: '分类',
                    on: false,
                    href: '#',
                    icon: 'http://localhost:8888/imgs/circle.png',
                    iconOn: 'http://localhost:8888/imgs/circle_on.png'
                },
                {
                    id: 3,
                    name: 'cart',
                    ttl: '购物车',
                    on: false,
                    href: '#',
                    icon: 'http://localhost:8888/imgs/circle.png',
                    iconOn: 'http://localhost:8888/imgs/circle_on.png'
                },
                {
                    id: 4,
                    name: 'center',
                    ttl: '个人中心',
                    on: false,
                    href: '#',
                    icon: 'http://localhost:8888/imgs/circle.png',
                    iconOn: 'http://localhost:8888/imgs/circle_on.png'
                }
            ],
            cart_nums: 1
        }
    },
    methods: {
        test () {
            var a = 111;
        },
        test2 () {},
    }
}
</script>
<style lang="scss">
.footnav {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    width: 100%;
    height: 52px;
    padding: 6px 0;
    background: #fff;
    box-shadow: 1px 5px 15px rgba(50, 50, 50, 0.3);
    .iconOn {
        display: none;
    }
    li {
        position: relative;
        flex: 1;
        text-align: center;
        border-right: #eee 1px solid;
        &.on p {
            color: #ec5151;
        }
        &.on .icon {
            display: none;
        }
        &.on .iconOn {
            display: block;
        }
    }
    a {
        color: #aaa;
        &.router-link-exact-active p {
            color: #ec5151;
        }
    }
    span {
        display: block;
        height: 30px;
        img {
            position: absolute;
            width: 20px;
            left: 50%;
            top: 10%;
            margin-left: -10px;
        }
    }
    p {
        font-size: 11px;
        line-height: 20px;
    }
    .num {
        position: absolute;
        top: -8px;
        left: 30%;
        width: 20px;
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-style: normal;
        background: #ec5151;
        border-radius: 10px;
    }
}
</style>
