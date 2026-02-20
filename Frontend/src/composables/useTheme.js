import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
    const initTheme = () => {
        const saved = localStorage.getItem('theme')
        if (saved) {
            isDark.value = saved === 'dark'
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        applyTheme()
    }

    const applyTheme = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        applyTheme()
    }

    const setTheme = (dark) => {
        isDark.value = dark
        localStorage.setItem('theme', dark ? 'dark' : 'light')
        applyTheme()
    }

    onMounted(() => {
        initTheme()
    })

    watch(isDark, applyTheme)

    return { isDark, toggleTheme, setTheme }
}
