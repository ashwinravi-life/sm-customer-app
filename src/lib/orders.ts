import type { Order, OrderStage } from '@/data/types';

export const STAGE_ORDER: OrderStage[] = ['confirmed', 'lab', 'qc', 'ready', 'delivered'];

export function stageLabel(stage: OrderStage, order: Pick<Order, 'fulfilment'>) {
  const pickup = order.fulfilment === 'store_pickup';
  switch (stage) {
    case 'confirmed':
      return 'Order confirmed';
    case 'lab':
      return 'Lenses being made';
    case 'qc':
      return 'Fitting & quality check';
    case 'ready':
      return pickup ? 'Ready for pickup' : 'Out for delivery';
    case 'delivered':
      return pickup ? 'Picked up' : 'Delivered';
  }
}

export function stageDescription(stage: OrderStage, order: Pick<Order, 'fulfilment' | 'store'>) {
  const pickup = order.fulfilment === 'store_pickup';
  switch (stage) {
    case 'confirmed':
      return 'We have your prescription and frame details.';
    case 'lab':
      return 'Your lenses are being cut and coated at our lab.';
    case 'qc':
      return 'Lenses are fitted to your frame and checked for accuracy.';
    case 'ready':
      return pickup ? `Collect it from ${order.store}.` : 'Our delivery partner is on the way.';
    case 'delivered':
      return pickup ? 'Enjoy your new specs!' : 'Delivered to your address.';
  }
}

export function stageIndex(stage: OrderStage) {
  return STAGE_ORDER.indexOf(stage);
}

export function isActive(order: Order) {
  return order.stage !== 'delivered';
}
