export default class Team {
  constructor() {
    this.teamMembers = [];
  }

  addMember(member) {
    this.teamMembers.push(member);
  }
}
