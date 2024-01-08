import axios from 'axios';

export const login = async (email, password) => {
  try {
    const body = {
      email,
      password,
    };

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: body,
    });

    if (res.data.status === 'success') {
      alert('Logged in sucessfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
