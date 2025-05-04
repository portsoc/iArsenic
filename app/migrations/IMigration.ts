export interface IMigration {
    up: () => Promise<boolean>
    down: () => Promise<boolean>
}