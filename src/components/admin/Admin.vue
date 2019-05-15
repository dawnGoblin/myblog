<template>
    <div>
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </div>
</template>
<script>
import Footer from '../pages/Footer.vue'
import Header from './Header.vue'
export default {
    components: { Header, Footer }
}
</script>
