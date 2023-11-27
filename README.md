# DevCommunity

    프로젝트를 하기 위한 팀원 모집을 할 수 있는 개발자들의 커뮤니티 웹사이트를 목표
    개인적 욕심으로는 Task Management까지 할 수 있는 기능을 만들어 개발자들이 오래 머물 수 있게 만드는 것이 목표
    1차 목표는 Task Management 기능이 없는 상태에서 커뮤니티 사이트의 형태를 이루고 있고 구현한 기능들이 모두
    정상적으로 작동하는 것

## 기능

- Login - NextAuth를 이용해 로그인 페이지 따로 없이 구글 로그인으로 이용할 수 있게 만듬
- Profile - User profile 수정 가능한 페이지 만들 예정
- Post
  - Post를 작성할 수 있고 자신만의 Post만 모아서 볼 수 있으며 현재 CRUD 중 Create Read, Delete 구현해놓은 상태 Edit는 진행 예정
  - 유저들이 댓글과 대댓글을 달 수 있으며 댓글의 depth는 1차까지만 된다. (네이버 댓글 기능 모티브)
- Project - Project를 작성할 수 있고 자신만의 Project를 다수로 생성 가능 & CRUD 중 Create, Read, Delete 구현해놓은 상태, Edit는 진행 예정
- Team - 유저는 자신의 팀을 만들어 Project를 생성시킬 수 있고 특정 유저에게 초대를 보내 팀원을 구성할 수 있다.
  - 팀이 먼저 만들어져야지만 Project를 생성할 수 있는 조건이 있다.
- User
  1. 유저는 유저 유형에 있어서 팀에 가입을 함으로써 Leader / Member라는 Membership을 가진다.
  2. 아직 리더만 멤버를 초대할 수 있다. ( 현재, 추후에 Role 베이스로 멤버에게 역할을 할당하여 초대할 수 있게 만들 예정)
  3. 팀의 리더는 Project 지원자(Pending인 상태)의 지원을 취소할 수 있다.
  4. 팀의 초대를 받은 User는 수락/거절을 할 수 있다.
  5. 팀의 리더들이 만들어놓은 Project에 지원할 수 있다. ( 지원했던 Project에 팀 리더가 수락하지 않은 상태(Pending)인 상태에서 취소 가능
- Notification - type을 더 많이 만들어서 유저의 활동을 구체적으로 보여줄 수 있도록 할 예정
  1. 만약 User가 Project의 구성원이 되면 자동적으로 Project의 리더의 팀에 속하게 되며 기존의 팀 구성원에게 Notification이 간다.
  2. Notification Type에는 12개가 있다.
  - 유저가 Post를 '좋아요'를 할 때
  - 유저가 Comment를 '좋아요'를 할 때
  - 팀의 리더가 다른 유저를 팀에 초대할때 'PENDING_INVITATION' 을 통해 팀의 리더는 자신의 팀 관리에서 초대한 유저의 응답이 Pending/Accepted/Rejected 됐는지 확인 가능 (현재는 Pending 상태인 경우 My Teams에서 확인 가능) /
  3.  Accepted와 Rejected는 왼쪽 사이드 내비게이션 메뉴의 Notification 탭에서 확인 가능

## 느낀점

- React Query를 사용하여 데이터 상태 관리를 했는데 useState나 useEffect를 활용하여 데이터 관리하는 것보다 훨씬 효율적이기도 하고 데이터가 변경됐을 시에 Query key를 통해 데이터를 다시 fetching 해와 변경된 데이터를 반영해주는 것도 편리하다.

- DB의 관계 설정을 해본 지 오래되어 익숙하지 않았는데 Prisma를 활용하면서 더 쉽게 만들 수 있었지만 데이터를 fetching 해오는 시간이 길어지는 느낌은 무시할 수가 없다. 최근에 DrizzleORM이 나왔는데 Prisma에 비해 속도도 빠르다고 하니 그것도 한 번 적용해보는 것도 좋을 것 같다.

- UI를 Dribble이나 Pinterest에서 참고하면서 만들긴 했지만 내가 원하는 디자인은 찾을 수 없어 UI에 많은 비중을 두지 못하고 DB 관계나 기능 위주에 초점을 맞춘 것이 아쉽다. 다만, 추후 Improvement에 대한 여지는 남아있다.

- 계획해놓은 기능을 모두 구현한 후에 CI/CD까지 구축하여 배포 및 서비스를 유저들이 사용하도록 해보고 싶다.

- 서비스를 만들기 전 필요한 기능에 대한 Spec과 각 페이지에 대한 Layout, Design, UX까지 고려하여 기획이 먼저 철저하게 계획되어 있어야 개발자가 기능이나 UI를 구현하는 데에 지체없이 빠르게 개발할 수 있다는 점을 새삼스럽게 느꼈다. 실무에서도 기획 단에서 프론트엔드 개발자가 개발하고 있는 와중에 변경이 계속 되어지면 프론트엔드 개발자의 피로도는 엄청나게 증가한다. 사이드 프로젝트를 빨리 만들어보려는 큰 그림만 계획하고 세부적인 것들을 계획하지 않은 상태에서 개발하려고 하다 보니 기능을 만들다가도 UI를 어떻게 할 지에 대해 고민하게 되고 결과적으론 지체를 만들어낸다. 이러한 관점에서 기획자, 디자이너와의 의사소통은 정말 중요하다는 점을 다시 한 번 느끼고 최대한 구체적으로 의사소통을 많이 해야 품질 좋은 서비스를 만들어낼 수 있음을 다시 한 번 깨닫는다.
