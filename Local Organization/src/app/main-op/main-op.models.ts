export interface ItemsRevision {
    revision: number;
    items: ItemInfo[];
}

export interface ItemInfo {
    modifiedAtRevision?: number;
    entityId: number;
    entityName: string;
    elligibleSlots?: EquippedSlot[];
    assetsFolderPath: string;
    artFolderPath: string;
}

export interface ItemDef {
    itemInfo: ItemInfo;
    name: string;
    description: string;
    commands: Command[];
    commands2D: Command2D[];
    equippedSlots: EquippedSlot[];
    unequippedPlacement: ContainerType[];
    containerType: ContainerType;
    
}

export enum EquippedSlot {
    RightHand, // Hold things in your left hand that do stuff
    Head, // Hats, Head Armor,
    LeftHand, // Hold things in your left hand that do stuff

    UpperExtra, // Exoskeletons, Sidearm Straps, Body Armor
    UpperBody, // Clothing, Body Armor
    Back, // Backpack, Duffel Bags, Bow Straps. Some backpacks can open the BeltHangingSpot.

    BeltHanging, // Once you have a belt or a special backpack you can hang certain items to it.
    Pants, // Pants don't really matter in this game, unless you place some socks in them.
    Belt, // If you don't have a belt, you can tuck a gun here. You can also place a Sidearm belt and have extra attack with the gun you place in the BeltHangingSpot.

    BootWeapon, // Knifes, Small Guns. Can be activated only by BootStrapSpot items.
    Boots,
    BootStraps, // You can have boot straps that hold weapons, Extra Feet Armor.
}

export const EquippedSlotList = [
    EquippedSlot.RightHand,
    EquippedSlot.Head,
    EquippedSlot.LeftHand,
    EquippedSlot.UpperExtra,
    EquippedSlot.UpperBody,
    EquippedSlot.Back,
    EquippedSlot.BeltHanging,
    EquippedSlot.Pants,
    EquippedSlot.Belt,
    EquippedSlot.BootWeapon,
    EquippedSlot.Boots,
    EquippedSlot.BootStraps,
];

export enum ContainerType {
    Pockets,
    Backpack,
    DuffleBag,
    KeyChain,
}

export const ContainerTypeList = [
    ContainerType.Pockets,
    ContainerType.Backpack,
    ContainerType.DuffleBag,
    ContainerType.KeyChain,
];

export enum Command {
    Default,
    Pickup,
    Throw,
    Read,
    MoveTo,
}
export const CommandList = [Command.Default, Command.Pickup, Command.Throw, Command.Read, Command.MoveTo];

export enum Command2D {
    None,
    Use,
    Throw,
    Drop,
    Move,
    Read,
    Examine,
}

export const Command2DList = [
    Command2D.None,
    Command2D.Use,
    Command2D.Throw,
    Command2D.Drop,
    Command2D.Move,
    Command2D.Read,
    Command2D.Examine,
];
