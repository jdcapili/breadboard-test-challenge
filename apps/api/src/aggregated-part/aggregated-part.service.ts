import { Injectable } from '@nestjs/common';
import { CreateAggregatedPartDto } from './dto/create-aggregated-part.dto';
import { UpdateAggregatedPartDto } from './dto/update-aggregated-part.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, tap } from 'rxjs';
import { AggregatedPart, Packaging, PriceBreak } from '../shared/types/aggregated-part';

@Injectable()
export class AggregatedPartService {
  constructor(private httpService: HttpService) {};

  create(createAggregatedPartDto: CreateAggregatedPartDto) {
    return 'This action adds a new aggregatedPart';
  }

  async findAll(partNumber: string) {
    const myArrow = await lastValueFrom(this.httpService
      .get("https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json")
    )
    
    const tti = await lastValueFrom(this.httpService
      .get("https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json")
    )
    
    const agg = aggregateParts(myArrow.data.pricingResponse, tti.data.parts, partNumber)

    return agg;
  }

  findOne(id: number) {
    return `This action returns a #${id} aggregatedPart`;
  }

  update(id: number, updateAggregatedPartDto: UpdateAggregatedPartDto) {
    return `This action updates a #${id} aggregatedPart`;
  }

  remove(id: number) {
    return `This action removes a #${id} aggregatedPart`;
  }
}

const aggregateParts = (arrowData, ttiData, partNumber): AggregatedPart[] => {
  // dummy query param part name
  let queryParam = partNumber

  let aggregates = {};
  
  // arrow data handler
  arrowAggregation(aggregates, arrowData, queryParam)

  // tti data handler
  ttiAggregation(aggregates, ttiData, queryParam)
  
  for (let k in aggregates){
    let data = aggregates[k];

    data.description = Array.from(data.description).join('. ');
    data.sourceParts = Array.from(data.sourceParts);
    data.manufacturerLeadTime = data.manufacturerLeadTime * 7;
    aggregates[k] = data;
  }

  return Object.values(aggregates)
}

// arrow data handler
const arrowAggregation = (aggregates, arrowData, queryParam) => {
  // myArrow api
  arrowData.forEach(element => {
    if (!element.partNumber.startsWith(queryParam)) {
      return;
    }

    if (!aggregates[element.partNumber]){
      aggregates[element.partNumber] = {
        name: element.partNumber,
        description: new Set(),
        manufacturerName: element.manufacturer,
        sourceParts: new Set(),
        totalStock: 0,
        packaging: [],
        manufacturerLeadTime: undefined,
      }
    }

    let base = aggregates[element.partNumber];
    base.description.add(element.description);
    base.sourceParts.add('Arrow');

    element.urlData?.forEach(e => {
      let k = '';
      if (e.type === 'Datasheet'){
        k = 'productDoc';
      }else if (e.type === 'Part Details') {
        k = 'productUrl';
      }else if (e.type === 'Image Small') {
        k = 'productImageUrl';
      }

      if (k !== ''){
        base[k] = e.value;
      }
    })

    base.totalStock += parseInt(element.fohQuantity)
    base.packaging.push(arrowPackaging(aggregates, element))

    aggregates[element.partNumber] = base
  });
}

const arrowPackaging = (aggregates, parentData): Packaging => {
  if(parentData.leadTime){
    aggregates[parentData.partNumber].manufacturerLeadTime = (
      aggregates[parentData.partNumber].manufacturerLeadTime ?
        Math.min(aggregates[parentData.partNumber].manufacturerLeadTime, parentData.leadTime.arrowLeadTime) :
        parentData.leadTime.arrowLeadTime
    )
  }

  return {
    type: parentData.pkg,
    minimumOrderQuantity: parentData.minOrderQuantity,
    quantityAvailable: parentData.fohQuantity,
    unitPrice: parentData.resalePrice,
    supplier: parentData.supplier,
    priceBreaks: parentData.pricingTier ? parentData.pricingTier.map(arrowPriceBreaks) : [],
    ...(parentData.leadTime ? {manufacturerLeadTime: `${parseInt(parentData.leadTime.arrowLeadTime) * 7} days`} : {})
  }
}

const arrowPriceBreaks = (pricingTier): PriceBreak => {
  return {
    breakQuantity: pricingTier.minQuantity,
    unitPrice: pricingTier.resalePrice,
    totalPrice: pricingTier.minQuantity * pricingTier.resalePrice
  }
}

const ttiAggregation = (aggregates, ttiData, queryParam) => {
  ttiData.forEach(element => {
    if (!element.ttiPartNumber.startsWith(queryParam)) {
      return;
    }

    if(!aggregates[element.ttiPartNumber]){
      aggregates[element.ttiPartNumber] = {
        name: element.ttiPartNumber,
        description: new Set(),
        manufacturerName: element.manufacturer,
        sourceParts: new Set(),
        totalStock: 0,
        packaging: [],
      }
    }

    let base = aggregates[element.ttiPartNumber];

    base.description.add(element.description);
    base.sourceParts.add('TTI');

    // not sure what to do when productDoc, URL, and Image url are different(from a different source)
    // element.urlData?.forEach(e => {
    //   let k = '';
    //   if (e.type === 'Datasheet'){
    //     k = 'productDoc';
    //   }else if (e.type === 'Part Details') {
    //     k = 'productUrl';
    //   }else if (e.type === 'Image Small') {
    //     k = 'productImageUrl';
    //   }

    //   if (k !== ''){
    //     base[k] = e.value;
    //   }
    // })

    base.totalStock += parseInt(element.availableToSell)
    base.packaging.push(ttiPackaging(aggregates, element))
  })
}

const ttiPackaging = (aggregates, parentData): Packaging => {
  let leadTime = parentData.leadTime ? parseInt(parentData.leadTime.split(' ')[0]) : null
  if(leadTime){
    aggregates[parentData.ttiPartNumber].manufacturerLeadTime = (
      aggregates[parentData.ttiPartNumber].manufacturerLeadTime ?
        Math.min(aggregates[parentData.ttiPartNumber].manufacturerLeadTime, leadTime) :
        leadTime
    )
  }

  return {
    type: parentData.packaging,
    minimumOrderQuantity: parentData.salesMinimum,
    quantityAvailable: parentData.availableToSell,
    unitPrice: parentData.pricing.vipPrice,
    supplier: parentData.manufacturer,
    priceBreaks: parentData.pricing.quantityPriceBreaks ? parentData.pricing?.quantityPriceBreaks.map(ttiPriceBreaks) : [],
    ...(leadTime ? {manufacturerLeadTime: `${leadTime * 7} days`} : {})
  }
}

const ttiPriceBreaks = (pricingBreak): PriceBreak => {
  return {
    breakQuantity: pricingBreak.quantity,
    unitPrice: pricingBreak.price,
    totalPrice: pricingBreak.quantity * pricingBreak.price
  }
}
