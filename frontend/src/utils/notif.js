import { ref } from 'vue'


const notif = {

    all: ref([]),

    add: (message, type = 'info', duration = 3000) => {
        const id = Date.now()
        notif.all.value.push({ id: id, message, type })

        // remove based on given time
        if (duration) setTimeout(() => notif.remove(id), duration)
    },
    
    addError: (error) => notif.add(error.response?.data ?? error.toString(), "error"),

    remove: (id) => notif.all.value = notif.all.value.filter((n) => n.id !== id),

}


export default notif