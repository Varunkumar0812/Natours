import axios from 'axios';

export const login = async (email, password) => {
  try {
    console.log(email, password);

    const body = {
      email,
      password,
    };

    console.log('Varun: ', body);

    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: body,
    });

    if (res.data.status === 'success') {
      alert('Logged in sucessfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};
