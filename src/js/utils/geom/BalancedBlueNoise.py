import random as rs
import json
def getBalanced(n):
  balanced = []
  allowedItems = {1}
  allowedSteps = []
  for i in range(1, int(n/2)+1):
    allowedItems.add(i)
    allowedItems.add(i+int(n/2))
    allowedSteps.append(i)
    allowedSteps.append(-i)
    pass
  balanced.append(1)
  allowedItems.remove(1)
  rs.shuffle(allowedSteps)
  def getNextElement(balanced, allowedItems, allowedSteps):
    if allowedItems == set() and (balanced[0] - balanced[-1]) in allowedSteps:
      return balanced
    elif allowedItems == set():
      return []
    else:
      for step in allowedSteps:
        if (step + balanced[-1]) in allowedItems:
          balancedTemp = balanced.copy()
          balancedTemp.append(step + balanced[-1])
          allowedItemsTemp = allowedItems.copy()
          allowedItemsTemp.remove(step + balanced[-1])
          allowedStepsTemp = allowedSteps.copy()
          allowedStepsTemp.remove(step)
          theList = getNextElement(balancedTemp, allowedItemsTemp, allowedStepsTemp)
          if theList != []:
            return theList
            break
          pass
        pass
      return []
      
  balanced = getNextElement(balanced, allowedItems, allowedSteps)
  return balanced
# method to verify that a sequence is balanced
def differences(arr):
    seq = arr
    seq.append(arr[0])
    d = [i-j for i,j in zip(seq[1:], seq[:-1])]
    d.sort()
    return d
# Prints a randomly generated balanced sequence of length 16.


dat = {}
count = 16
res = open( 'bn_seeds.json', 'w+')
for n in range( 8, 33, 2 ):
    nst = str( n )
    dat[nst] = []
    print( "compute for", n )
    for i in range( 0, count ):
        dat[nst].append( getBalanced(n) )

json.dump( dat, res)