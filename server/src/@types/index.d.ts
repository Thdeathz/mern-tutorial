declare interface UserData {
  username: string
  password: string
  roles: string[]
  active: boolean
}

declare interface NoteData {
  user: object
  title: string
  text: string
  completed: boolean
}
