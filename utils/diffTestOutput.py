import sys, re

'''
given the name (or path) of a file, returns a 'summary' object containing which tests pass/fail
'''
def getTestSummary(f):
  summary = {
    'success': set(),
    'fail': set()
  }
  curTestName = ''
  fp = open(f)

  for i, line in enumerate(fp):
    if line.startswith("# file"):
      if curTestName != '':
        if not curTestName in summary['fail']:
          summary['success'].add(curTestName)
      curTestName = getTestName(line)  
    elif line.startswith("ok"):
      continue
    elif line.startswith("1.."):
      break
    elif line.startswith("not ok"):
      summary['fail'].add(curTestName)
    elif line.startswith(" "):
      if not curTestName in summary['fail']:
        summary['fail'].add(curTestName)

  return summary

def getDiff(summary1, summary2):
  all_failed = summary1['fail'] | summary2['fail'] # set union
  all_successful = summary1['success'] | summary2['success']

  print("\n\nDiff of failed tests:\n")
  for failed_test in all_failed:
    if not failed_test in summary2['fail']:
      print("< "+failed_test)
    elif not failed_test in summary1['fail']:
      print("> "+failed_test)

  print("\n\nDiff of successful tests:\n")
  for successful_test in all_successful:
    if not successful_test in summary2['success']:
      print("< "+successful_test)
    elif not successful_test in summary1['success']:
      print("> "+successful_test)


def getTestName(line):
  r = re.compile("^.*test: (.*)$")
  x = r.search(line)

  if not x.group(1):
    raise Exception(line)
  else:
    s = x.group(1).replace('_EIP158', '').replace('_Byzantium', '')
    return s

if __name__ == "__main__":
  if len(sys.argv) < 3:
    print("need two files to diff..")
    sys.exit(-1)

  file1Name = sys.argv[1]
  file2Name = sys.argv[2]

  summary1 = getTestSummary(file1Name)
  summary2 = getTestSummary(file2Name)

  getDiff(summary1, summary2)
