const Profile = ({ params }: { params: { userName: string } }) => {
  return (
    <div>
      <h1>Profile 페이지</h1>
      userId: {decodeURIComponent(params.userName)}
    </div>
  );
};

export default Profile;
