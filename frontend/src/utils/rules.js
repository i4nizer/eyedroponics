

const rules = {
    required: v => !!v || 'This field is required',
    min3: v => v.length >= 3 || 'This field must be at least 3 characters',
    min8: v => v.length >= 8 || 'This field must be at least 8 characters',
    email: v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Please enter a valid email address',
}


export default rules