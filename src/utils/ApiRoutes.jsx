const ApiRoutes = {
    Login: {
        path: "/users/login",
        authenticate: "false"
    },

    SignUp: {
        path: "/users/signupUser",
        authenticate: "false"
    },

    GetUser: {
        path: "/users/getUser",
        authenticate: true
    },

    GetAllUsers: {
        path: "/users/getAllUsers",
        authenticate: false
    },

    AddNote: {
        path: "/notes/addnote",
        authenticate: true
    },

    EditNote: {
        path: "/notes/editnote",
        authenticate: true
    },

    GetAllNotes: {
        path: "/notes/getAllNotes",
        authenticate: true
    },

    DeleteNote: {
        path: "/notes/deleteNote",
        authenticate: true
    },

    SearchNotes: {
        path: "/notes/searchNotes",
        authenticate: true
    },

    UpdateNotePinned: {
        path: "/notes/updateNotePinned",
        authenticate: true
    }
    
}

export default ApiRoutes;