#!/bin/bash

aws dynamodb create-global-table \
    --global-table-name $global_dynamoDB \
    --replication-group RegionName=$global_region1 \
    --region $region
