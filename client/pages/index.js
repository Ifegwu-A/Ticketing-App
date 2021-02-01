import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('currentUser: ', currentUser);
  return currentUser ? (
    <h1> You are singed in</h1>
  ) : (
    <h1> You are not Signed in </h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('in the Landing page');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
