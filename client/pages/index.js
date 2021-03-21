import buildClient from '../api/build-client'

function LandingPage({ currentUser }) {

    console.log(currentUser);

    return (
        <div>
            {currentUser && <h1>Welcome, {currentUser.email}</h1>}
            {!currentUser && <h1>You are not signed in</h1>}
        </div>
    )
}

LandingPage.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get('/api/users/currentuser');
    return data;
};

export default LandingPage