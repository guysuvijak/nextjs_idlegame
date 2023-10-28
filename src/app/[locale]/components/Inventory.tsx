import React, { useState } from 'react';
import Image from 'next/image';

const Inventory = ({itemDrop}: any) => {
  const [ tooltipPosition, setTooltipPosition ] = useState({ x: 0, y: 0 });
  const [ tooltipItem, setTooltipItem ] = useState<any>(null);

  const totalCells = 50;

  const inventoryData = [
    { item_id: 1, item_name: 'Lord Boots', item_desc: 'boots', item_type: 'equipment', item_grade: 'S', item_img: '/boots.webp', item_qty: 1, item_trade: false},
    { item_id: 2, item_name: 'Lord Armor', item_desc: 'armor', item_type: 'equipment', item_grade: 'S', item_img: '/armor.webp', item_qty: 1, item_trade: false},
    { item_id: 3, item_name: 'Lord Sword', item_desc: 'sword', item_type: 'equipment', item_grade: 'S', item_img: '/sword.webp', item_qty: 1, item_trade: false},
    { item_id: 4, item_name: 'Mushroom', item_desc: 'drop from "LEVEL 3 - Mush Kid"', item_type: 'etc', item_grade: 'D', item_img: '/mushroom.png', item_qty: 16, item_trade: true},
  ];

  const emptyCells = new Array(totalCells - inventoryData.length).fill(null);

  const showTooltip = (event: any, item :any, action: string) => {
    const x = event.clientX;
    const y = event.clientY;

      setTooltipPosition({ x, y });
      setTooltipItem(item);
  };

  const hideTooltip = () => {
    setTooltipItem(null);
  };

  const handleItemDrop = (item: any) => {
    itemDrop(item);
  };

  const InventoryCell = ({ item, showTooltip, hideTooltip }: any) => {
    return (
      <div
        className={`inventory-cell ${item ? 'inventory-has-item' : ''}`}
        style={{borderColor: item ? colorItem(item.item_grade) : ''}}
        onMouseEnter={(e) => showTooltip(e, item, 'handle')}
        onMouseLeave={hideTooltip}
      >
        {item &&
          <div>
            <Image src={item.item_img} alt={item.item_name} width='50' height='50' />
            <div className='inventory-cell-qty' style={{display: item.item_type === 'equipment' ? 'none' : 'flex', cursor: 'default'}}>{item.item_qty}</div>
          </div>
        }
      </div>
    );
  };

  const InventoryTable = ({ data, showTooltip, hideTooltip }: any) => {
    return (
      <div className='inventory-table' onMouseEnter={hideTooltip}>
        {data.map((item: any, index: any) => (
          <InventoryCell key={index} item={item} showTooltip={showTooltip} hideTooltip={hideTooltip} />
        ))}
      </div>
    );
  };
  
  const colorItem = (item: any) => {
    let itemColor;

    switch(item) {
      case 'D':
        itemColor = '#909090';
        break;
      case 'C':
        itemColor = '#1eff00';
        break;
      case 'B':
        itemColor = '#0070dd';
        break;
      case 'A':
        itemColor = '#a335ee';
        break;
      case 'S':
        itemColor = '#ff8000';
        break;
      case 'SS':
        itemColor = '#ffea00';
        break;
      case 'SSS':
        itemColor = '#cc0a1f';
        break;
      default:
        itemColor = '#c6c6c6';
        break;
    }

    return itemColor;
  }

  return (
    <div className='p-[15px]' onMouseEnter={hideTooltip}>
      <InventoryTable data={inventoryData.concat(emptyCells)} showTooltip={showTooltip} hideTooltip={hideTooltip} />
      {tooltipItem && (
        <div
          className='inventory-item-tooltip'
          style={{ top: tooltipPosition.y + 10, left: tooltipPosition.x + 10, borderColor: colorItem(tooltipItem.item_grade)}}
        >
          <div className='flex flex-row justify-between'>
            <Image src={tooltipItem.item_img} alt={tooltipItem.item_name} width='100' height='100' />
            <div className='text-2xl' style={{color: colorItem(tooltipItem.item_grade)}}>{tooltipItem.item_grade}</div>
          </div>
          <p className='font-medium' style={{color: colorItem(tooltipItem.item_grade)}}>{tooltipItem.item_name}</p>
          <p className='text-slate-500'>{tooltipItem.item_desc}</p>
          {tooltipItem.item_trade ?
            <p className='text-right text-green-500'>Tradeable</p> : <p className='text-right text-red-500'>Non-Tradeable</p>
          }
        </div>
      )}
    </div>
  );
};

export default Inventory;