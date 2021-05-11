<template>
    <div class="theme_wrap">
        <div @click="showConfirm">
            <i class="icomoon-theme"></i>
        </div>
        <confirm ref="confirm" @confirm="changeTheme(switchTheme.key)" :text="confirmText"></confirm>
    </div>
</template>
<script>
    import lightTheme from '../../style/theme/light'
    import darkTheme from '../../style/theme/dark'
    import Confirm from 'base/confirm/confirm'
    import { loadTheme, saveTheme } from 'common/js/cache'
    const themes = {
        'dark': 'dark',
        'light': 'light'
    }
    const themesMap = {
        [themes.dark]: darkTheme,
        [themes.light]: lightTheme
    }
    export default {
        data () {
            return {
                currentTheme: '',
                switchTheme: {},
                themeObj: '',
                confirmText: ''
            }
        },
        created() {
            this.setDefaultTheme()
        },
        components: {
            Confirm
        },
        watch: {
            currentTheme (val) {
                this.themeObj = {
                    name: val === 'dark' ? '深色' : '浅色',
                    key: val
                }
                this.switchTheme = {
                    name: val === 'dark' ? '浅色' : '深色',
                    key: val === 'dark' ? 'light' : 'dark'
                }
                this.confirmText = `当前为${this.themeObj.name}主题,是否切换为${this.switchTheme.name}主题?`
            }
        },
        methods: {
            setDefaultTheme () {
                const key = loadTheme() || 'dark'
                this.changeTheme(key)
            },
            showConfirm () {
                this.$refs.confirm.show()
            },
            changeTheme (key) {
                const theme = themesMap[key]
                Object.keys(theme).forEach((_key) => {
                    const value = theme[_key]
                    document.documentElement.style.setProperty(_key, value)
                })
                this.currentTheme = key
                saveTheme(key)
            }
        }
    }
</script>
<style lang="stylus">
    .icomoon-theme
      display: block
      padding: 12px
      font-size: 26px
</style>