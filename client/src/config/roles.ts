export type ROLE = 'Employee' | 'Manager' | 'Admin'

export const ROLES: {
  [key in ROLE]: ROLE
} = {
  Employee: 'Employee',
  Manager: 'Manager',
  Admin: 'Admin'
}
