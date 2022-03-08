#!/bin/bash

rails website:sync_from_b2_to_local
rails website:convert_sync_to_local
