# Additional clean files
cmake_minimum_required(VERSION 3.16)

if("${CONFIG}" STREQUAL "" OR "${CONFIG}" STREQUAL "Debug")
  file(REMOVE_RECURSE
  "CMakeFiles\\chatclient_autogen.dir\\AutogenUsed.txt"
  "CMakeFiles\\chatclient_autogen.dir\\ParseCache.txt"
  "chatclient_autogen"
  )
endif()
