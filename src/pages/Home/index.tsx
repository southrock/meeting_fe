import * as React from 'react';

const { useState } = React;

interface FormType {
  username: string;
  password: string;
  [propName: string]: string;
}

const Home = () => {

  const [ formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const newValue: FormType = {...formValues};
    newValue[name] = value;
    setFormValues(newValue);
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.persist();
    e.preventDefault();
  };

  return (
    <div>
      会议注册报名系统
      <div>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="username">账号：</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formValues.username}
            onChange={handleChange}
          />
          <label htmlFor="password">密码：</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formValues.password}
            onChange={handleChange}
          />
          <input type="submit" value="登录"/>
        </form>
      </div>
    </div>
  );
};

export default Home;
