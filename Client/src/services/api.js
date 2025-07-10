const BASE_URL = import.meta.env.VITE_SERVER_URL;

const API_ROUTES = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    logout: `${BASE_URL}/api/auth/logout`,
    signup: `${BASE_URL}/api/auth/signup`,
  },
  users: {
    getDetails: (id) => `${BASE_URL}/api/users/details/${id}`,
    getLogin: `${BASE_URL}/api/users/getUser`,
    getAll: `${BASE_URL}/api/users/all`,
    delete: (id) => `${BASE_URL}/api/users/${id}`,
    update: (id) => `${BASE_URL}/api/users/${id}`,
  },
  departments: {
    getAll: `${BASE_URL}/api/departments/all`,
    create: `${BASE_URL}/api/departments`,
  },
  posts: {
    getAll: `${BASE_URL}/api/posts/all`,
    getById: (id) => `${BASE_URL}/api/posts/${id}`,
    create: `${BASE_URL}/api/posts`,
    update: (id) => `${BASE_URL}/api/posts/${id}`,
    delete: (id) => `${BASE_URL}/api/posts/${id}`,
    getByUser: (id) => `${BASE_URL}/api/posts/users/${id}`,

    details: (id) => `${BASE_URL}/api/posts/details/${id}`,
    search: `${BASE_URL}/api/posts/search`,
    approve: (id) => `${BASE_URL}/api/posts/approve/${id}`,
    reject: (id) => `${BASE_URL}/api/posts/reject/${id}`,
    vote: {
      up: (id) => `${BASE_URL}/api/posts/votes/up/${id}`,
      down: (id) => `${BASE_URL}/api/posts/votes/down/${id}`,
      get: (id) => `${BASE_URL}/api/posts/votes/${id}`,
    },

    comments: {
      add: (id) => `${BASE_URL}/api/posts/comments/${id}`,
      delete: (id) => `${BASE_URL}/api/posts/comments/${id}`,
      getAll: (id) => `${BASE_URL}/api/posts/comments/${id}/all`,
    },

    solutions: {
      add: (id) => `${BASE_URL}/api/solutions/posts/${id}`,
      update: (id) => `${BASE_URL}/api/solutions/${id}`,
      delete: (id) => `${BASE_URL}/api/solutions/${id}`,
      get: (id) => `${BASE_URL}/api/solutions/${id}`,
    },
  },
};

export default API_ROUTES;
