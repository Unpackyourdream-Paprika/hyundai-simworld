export enum PacketType {
  PKT_C_LOGIN = 'PKT_C_LOGIN',
  PKT_S_LOGIN = 'PKT_S_LOGIN',
}

export interface TcpPacket {
  id: number;
  packetId: PacketType;
  data?: any;
}
